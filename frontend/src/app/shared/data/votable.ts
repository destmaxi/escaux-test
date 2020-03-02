
export interface Votable {
    getID(): string;
    getValue(): number;
    upvote(): void;
    downvote(): void;
}
