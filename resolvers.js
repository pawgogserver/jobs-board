import { Job, Company } from './db.js';

function rejectIf(condition) {
    if (condition) {
        throw new Error ('Unauthorized user!');
    }
}

export const resolvers = {
    Query: {
        company:(_root, { id }) => Company.findById(id),
        job:(_root, { id }) => Job.findById(id),
        jobs: () => Job.findAll(),
    },

    Mutation: {
        createJob: (_root, { input }, { user }) => {
            rejectIf(!user);
            return Job.create({ ...input, companyId: user.companyId });
        },
        deleteJob: async (_root, { id }, { user }) => {
            rejectIf(!user);
            const job = Job.findById(id);
            rejectIf(job.companyId !== user.companyId);
            return Job.delete(id)
        },
        updateJob: async (_root, { input }, { user }) => {
            rejectIf(!user);
            const job = Job.findById(input.id);
            rejectIf(job.companyId !== user.companyId);
            return Job.update({ ...input, companyId: user.companyId });
        },
    },

    Job: {
        company: ({ companyId }) => {
            return Company.findById(companyId)
        }
    },

    Company: {
        jobs: (company) => {
            return Job.findAll((job) => job.companyId === company.id)
        }
    }
} 