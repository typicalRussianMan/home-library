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

    async put(requestURL, body) {
        fetch(this.JSON_URL+"/"+requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        })
    }

    async update(requestURL, body) {
        
        this.delete(requestURL).then(() => {
            this.put(body);
        })
        
    }

    async delete(requestURL) {
        fetch(this.JSON_URL+"/"+requestURL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        })
    }
}