
import React, { useState, useMemo } from 'react';
import { AppData, Farm, Job, Review, User, UserType, JobType } from './types';
import { sampleData, ALL_TAGS, ALL_REGIONS, REGIONAL_ZONES } from './data/sampleData';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import FarmCard from './components/FarmCard';
import JobCard from './components/JobCard';
import Modal from './components/Modal';

type ActiveTab = 'farms' | 'jobs' | 'myFarms' | 'myApplications';

const App: React.FC = () => {
    const [appData, setAppData] = useLocalStorage<AppData>('ruralroots_v1', sampleData);
    const [activeTab, setActiveTab] = useState<ActiveTab>('farms');
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isAddFarmModalOpen, setAddFarmModalOpen] = useState(false);
    const [isAddJobModalOpen, setAddJobModalOpen] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('all');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [sortMethod, setSortMethod] = useState('rating');

    // Form states
    const [addFarmForm, setAddFarmForm] = useState({ name: '', location: '', region: REGIONAL_ZONES[0], description: '', tags: '', contact: '', website: '', image1: 'https://picsum.photos/seed/newfarm1/800/600', image2: 'https://picsum.photos/seed/newfarm2/800/600' });
    const [addJobForm, setAddJobForm] = useState({ title: '', type: 'full-time' as JobType, description: '', requirements: '', salary: '' });

    const handleLogin = (email: string, password: string): boolean => {
        const user = appData.users.find(u => u.email === email && u.password === password);
        if (user) {
            setAppData(prev => ({ ...prev, currentUser: user }));
            setAuthModalOpen(false);
            return true;
        }
        return false;
    };

    const handleRegister = (name: string, email: string, password: string, type: UserType): boolean => {
        if (appData.users.some(u => u.email === email)) {
            return false;
        }
        const newUser: User = { id: `u${Date.now()}`, name, email, password, type };
        setAppData(prev => ({
            ...prev,
            users: [...prev.users, newUser],
            currentUser: newUser,
        }));
        setAuthModalOpen(false);
        return true;
    };

    const handleLogout = () => {
        setAppData(prev => ({ ...prev, currentUser: null }));
        setActiveTab('farms');
    };
    
    const handleAddReview = (farmId: string, reviewData: { rating: number; text: string }) => {
        if (!appData.currentUser) return;

        const newReview: Review = {
            id: `r${Date.now()}`,
            userId: appData.currentUser.id,
            userName: appData.currentUser.name,
            ...reviewData,
            date: new Date().toISOString(),
        };

        setAppData(prev => {
            const updatedFarms = prev.farms.map(farm => {
                if (farm.id === farmId) {
                    const newReviews = [...farm.reviews, newReview];
                    const newRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
                    return { ...farm, reviews: newReviews, rating: parseFloat(newRating.toFixed(2)) };
                }
                return farm;
            });
            return { ...prev, farms: updatedFarms };
        });
    };

    const handleAddFarm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!appData.currentUser || appData.currentUser.type !== 'farm') return;
        const newFarm: Farm = {
            id: `f${Date.now()}`,
            ownerId: appData.currentUser.id,
            name: addFarmForm.name,
            location: addFarmForm.location,
            region: addFarmForm.region,
            description: addFarmForm.description,
            tags: addFarmForm.tags.split(',').map(t => t.trim()).filter(Boolean),
            rating: 0,
            contact: addFarmForm.contact,
            website: addFarmForm.website,
            images: [addFarmForm.image1, addFarmForm.image2],
            reviews: [],
        };
        setAppData(prev => ({...prev, farms: [...prev.farms, newFarm]}));
        setAddFarmForm({ name: '', location: '', region: REGIONAL_ZONES[0], description: '', tags: '', contact: '', website: '', image1: 'https://picsum.photos/seed/newfarm1/800/600', image2: 'https://picsum.photos/seed/newfarm2/800/600' });
        setAddFarmModalOpen(false);
    };

    const handleAddJob = (e: React.FormEvent) => {
        e.preventDefault();
        if (!appData.currentUser || appData.currentUser.type !== 'farm') return;
        const userFarm = appData.farms.find(f => f.ownerId === appData.currentUser?.id);
        if (!userFarm) {
            alert("You must add a farm before posting a job.");
            return;
        }

        const newJob: Job = {
            id: `j${Date.now()}`,
            farmId: userFarm.id,
            title: addJobForm.title,
            type: addJobForm.type,
            description: addJobForm.description,
            requirements: addJobForm.requirements.split(',').map(r => r.trim()).filter(Boolean),
            salary: addJobForm.salary,
            posted: new Date().toISOString(),
            applications: [],
        };
        setAppData(prev => ({...prev, jobs: [...prev.jobs, newJob]}));
        setAddJobForm({ title: '', type: 'full-time', description: '', requirements: '', salary: '' });
        setAddJobModalOpen(false);
    };

    const handleApplyForJob = (jobId: string) => {
        if (!appData.currentUser) return;
        setAppData(prev => ({
            ...prev,
            jobs: prev.jobs.map(job => 
                job.id === jobId && !job.applications.includes(appData.currentUser!.id)
                ? { ...job, applications: [...job.applications, appData.currentUser!.id] }
                : job
            ),
        }));
    };

    const filteredFarms = useMemo(() => {
        return appData.farms
            .filter(farm => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    farm.name.toLowerCase().includes(searchLower) ||
                    farm.location.toLowerCase().includes(searchLower) ||
                    farm.description.toLowerCase().includes(searchLower) ||
                    farm.tags.some(t => t.toLowerCase().includes(searchLower))
                );
            })
            .filter(farm => selectedTag === 'all' || farm.tags.includes(selectedTag))
            .filter(farm => selectedRegion === 'all' || farm.region === selectedRegion)
            .sort((a, b) => {
                if (sortMethod === 'rating') return b.rating - a.rating;
                if (sortMethod === 'name') return a.name.localeCompare(b.name);
                if (sortMethod === 'reviews') return b.reviews.length - a.reviews.length;
                return 0;
            });
    }, [appData.farms, searchTerm, selectedTag, selectedRegion, sortMethod]);

    const myFarms = appData.farms.filter(f => f.ownerId === appData.currentUser?.id);
    const myApplications = appData.jobs.filter(j => j.applications.includes(appData.currentUser?.id || ''));
    
    const renderFarmsTab = () => (
        <div>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 sticky top-0 z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search by name, location, tags..."
                        className="p-2 border border-border-gray rounded-md w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="p-2 border border-border-gray rounded-md w-full"
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {ALL_TAGS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                    </select>
                    <select
                        className="p-2 border border-border-gray rounded-md w-full"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                        <option value="all">All Regions</option>
                        {ALL_REGIONS.map(region => <option key={region} value={region}>{region}</option>)}
                    </select>
                    <select
                        className="p-2 border border-border-gray rounded-md w-full"
                        value={sortMethod}
                        onChange={(e) => setSortMethod(e.target.value)}
                    >
                        <option value="rating">Sort by Rating</option>
                        <option value="name">Sort by Name (A-Z)</option>
                        <option value="reviews">Sort by Review Count</option>
                    </select>
                </div>
            </div>
            {filteredFarms.map(farm => (
                <FarmCard key={farm.id} farm={farm} currentUser={appData.currentUser} onAddReview={handleAddReview} />
            ))}
        </div>
    );
    
    const renderJobsTab = () => (
        <div>
            {appData.currentUser?.type === 'farm' && (
                <div className="text-right mb-4">
                    <button onClick={() => setAddJobModalOpen(true)} className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition">
                        Post New Job
                    </button>
                </div>
            )}
            {appData.jobs.sort((a,b) => new Date(b.posted).getTime() - new Date(a.posted).getTime()).map(job => (
                <JobCard 
                    key={job.id} 
                    job={job} 
                    farm={appData.farms.find(f => f.id === job.farmId)}
                    currentUser={appData.currentUser}
                    onApply={handleApplyForJob}
                />
            ))}
        </div>
    );

    const renderMyFarmsTab = () => (
        <div>
            {myFarms.length > 0 ? (
                myFarms.map(farm => <FarmCard key={farm.id} farm={farm} currentUser={appData.currentUser} onAddReview={handleAddReview} />)
            ) : (
                <div className="text-center p-10 bg-white rounded-lg border-2 border-dashed border-border-gray">
                    <h2 className="text-2xl font-semibold mb-2">You haven't added any farms yet.</h2>
                    <p className="text-text-gray mb-4">Showcase your farm to the community!</p>
                    <button onClick={() => setAddFarmModalOpen(true)} className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition">
                        Add Your Farm
                    </button>
                </div>
            )}
        </div>
    );

    const renderMyApplicationsTab = () => (
         <div>
            {myApplications.length > 0 ? (
                myApplications.map(job => (
                    <JobCard 
                        key={job.id} 
                        job={job} 
                        farm={appData.farms.find(f => f.id === job.farmId)}
                        currentUser={appData.currentUser}
                        onApply={handleApplyForJob}
                    />
                ))
            ) : (
                <div className="text-center p-10 bg-white rounded-lg border-2 border-dashed border-border-gray">
                    <h2 className="text-2xl font-semibold mb-2">No applications yet.</h2>
                    <p className="text-text-gray mb-4">Explore the recruitment board and find your next opportunity.</p>
                    <button onClick={() => setActiveTab('jobs')} className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition">
                        Browse Jobs
                    </button>
                </div>
            )}
        </div>
    );
    
    const TabButton: React.FC<{tab: ActiveTab; label: string}> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold border-b-4 transition ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-gray hover:border-gray-300'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header currentUser={appData.currentUser} onLoginClick={() => setAuthModalOpen(true)} onLogout={handleLogout} />
            <main className="max-w-7xl mx-auto p-4">
                <nav className="flex space-x-4 border-b border-border-gray mb-6 bg-white rounded-t-lg p-2 shadow-sm">
                    <TabButton tab="farms" label="Farms & Reviews" />
                    <TabButton tab="jobs" label="Recruitment" />
                    {appData.currentUser?.type === 'farm' && <TabButton tab="myFarms" label="My Farms" />}
                    {appData.currentUser?.type === 'worker' && <TabButton tab="myApplications" label="My Applications" />}
                </nav>
                <div>
                    {activeTab === 'farms' && renderFarmsTab()}
                    {activeTab === 'jobs' && renderJobsTab()}
                    {activeTab === 'myFarms' && renderMyFarmsTab()}
                    {activeTab === 'myApplications' && renderMyApplicationsTab()}
                </div>
            </main>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} onLogin={handleLogin} onRegister={handleRegister} />
            <Modal isOpen={isAddFarmModalOpen} onClose={() => setAddFarmModalOpen(false)} title="Add Your Farm">
                 <form onSubmit={handleAddFarm} className="space-y-4">
                    <input className="w-full p-2 border rounded" placeholder="Farm Name" value={addFarmForm.name} onChange={e => setAddFarmForm({...addFarmForm, name: e.target.value})} required/>
                    <input className="w-full p-2 border rounded" placeholder="Location (e.g., City, State/Province)" value={addFarmForm.location} onChange={e => setAddFarmForm({...addFarmForm, location: e.target.value})} required/>
                    <select className="w-full p-2 border rounded bg-white" value={addFarmForm.region} onChange={e => setAddFarmForm({...addFarmForm, region: e.target.value})} required>
                        {REGIONAL_ZONES.map(zone => (
                            <option key={zone} value={zone}>{zone}</option>
                        ))}
                    </select>
                    <textarea className="w-full p-2 border rounded" placeholder="Description" value={addFarmForm.description} onChange={e => setAddFarmForm({...addFarmForm, description: e.target.value})} required/>
                    <input className="w-full p-2 border rounded" placeholder="Tags (comma-separated)" value={addFarmForm.tags} onChange={e => setAddFarmForm({...addFarmForm, tags: e.target.value})} required/>
                    <input className="w-full p-2 border rounded" placeholder="Contact Email" type="email" value={addFarmForm.contact} onChange={e => setAddFarmForm({...addFarmForm, contact: e.target.value})} required/>
                    <input className="w-full p-2 border rounded" placeholder="Website URL" type="url" value={addFarmForm.website} onChange={e => setAddFarmForm({...addFarmForm, website: e.target.value})} required/>
                    <button type="submit" className="w-full bg-primary text-white p-2 rounded hover:bg-primary-light">Add Farm</button>
                </form>
            </Modal>
            <Modal isOpen={isAddJobModalOpen} onClose={() => setAddJobModalOpen(false)} title="Post a New Job">
                 <form onSubmit={handleAddJob} className="space-y-4">
                    <input className="w-full p-2 border rounded" placeholder="Job Title" value={addJobForm.title} onChange={e => setAddJobForm({...addJobForm, title: e.target.value})} required/>
                    <select className="w-full p-2 border rounded" value={addJobForm.type} onChange={e => setAddJobForm({...addJobForm, type: e.target.value as JobType})}>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="seasonal">Seasonal</option>
                        <option value="contract">Contract</option>
                    </select>
                    <textarea className="w-full p-2 border rounded" placeholder="Job Description" value={addJobForm.description} onChange={e => setAddJobForm({...addJobForm, description: e.target.value})} required/>
                    <input className="w-full p-2 border rounded" placeholder="Requirements (comma-separated)" value={addJobForm.requirements} onChange={e => setAddJobForm({...addJobForm, requirements: e.target.value})} required/>
                    <input className="w-full p-2 border rounded" placeholder="Salary / Pay Range" value={addJobForm.salary} onChange={e => setAddJobForm({...addJobForm, salary: e.target.value})} required/>
                    <button type="submit" className="w-full bg-primary text-white p-2 rounded hover:bg-primary-light">Post Job</button>
                </form>
            </Modal>
        </div>
    );
};

export default App;
