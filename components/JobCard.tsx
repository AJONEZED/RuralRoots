
import React from 'react';
import { Job, Farm, User } from '../types';
import { ClockIcon } from './Icons';

interface JobCardProps {
  job: Job;
  farm: Farm | undefined;
  currentUser: User | null;
  onApply: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, farm, currentUser, onApply }) => {
  const hasApplied = currentUser ? job.applications.includes(currentUser.id) : false;

  return (
    <div className="bg-background-card rounded-lg border border-border-gray shadow-sm p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-primary">{job.title}</h3>
          <p className="text-text-gray font-semibold">{farm?.name}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800">{job.salary}</p>
          <span className="capitalize bg-tag-bg text-gray-700 px-3 py-1 text-sm rounded-full">{job.type}</span>
        </div>
      </div>
      <p className="text-text-gray my-4">{job.description}</p>
      <div>
        <h4 className="font-semibold mb-2">Requirements:</h4>
        <ul className="list-disc list-inside text-text-gray space-y-1">
          {job.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-border-gray">
        <div className="flex items-center text-sm text-text-gray">
          <ClockIcon className="w-4 h-4 mr-2" />
          Posted on {new Date(job.posted).toLocaleDateString()}
          <span className="mx-2">|</span>
          {job.applications.length} applicant(s)
        </div>
        {currentUser && (
          <button
            onClick={() => onApply(job.id)}
            disabled={hasApplied}
            className={`px-6 py-2 rounded-md font-semibold transition ${
              hasApplied
                ? 'bg-success-green text-success-text cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-light'
            }`}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
