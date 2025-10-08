export interface TicketsModel {
    _id?: string; // Add _id field
    project?: string;
    title?: string;
    description?: string;
    ticketAuthor?: string;
    priority?: string;
    status?: "new" | "in progress" | "resolved";
    type?: "Issue" | "Bug Fix" | "Feature Request";
    estimatedTime?: number; // Change from Number to number
    assignedDevs?: string[]; // Change from [string] to string[]
    comments?: Array<{ // Change from [{}] to Array<{}>
        author: string;
        comment: string;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
}