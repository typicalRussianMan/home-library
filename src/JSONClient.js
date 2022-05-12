export class JSONClient {
    constructor(url) {
        this.JSON_URL = url;
    }

    async get(requestURL) {
        let response = await fetch(this.JSON_URL+"/"+requestURL);
        let parsedData = await response.json();

        return parsedData;
    }

    async put(requestURL, body) {
        try {
            await fetch(this.JSON_URL+"/"+requestURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(body)
            })
        } catch(err) {  }
        
    }

    async delete(requestURL) {
        let response = await fetch(this.JSON_URL+"/"+requestURL, {
            method: "DELETE"
        })

        let result = await response.json();
        return result;
    }
}