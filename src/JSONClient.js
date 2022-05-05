export class JSONClient {
    constructor(url) {
        this.JSON_URL = url;
    }

    async get(requestURL) {
        const req = fetch(this.JSON_URL+"/"+requestURL).then(data => {
            return data.json()
        })
        return await req;
    }

    async getBooks(requestURL) {
        
    }
}