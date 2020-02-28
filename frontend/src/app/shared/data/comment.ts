export class Comment {
    getRate() {
        return this.rate
    }
    getComment() {
        return this.comment
    }
    constructor(private comment: string, private rate: number) {
    }
}
