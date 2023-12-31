const BASE_API_URL = "http://localhost:3001";

class FrienderApi{

  /** Formats requests. */

  static async request(endpoint, data = {}, method = "GET") {
    const url = new URL(`${BASE_API_URL}/${endpoint}`);
    const headers = {
      "content-type": "application/json",
    };

    url.search = method === "GET" ? new URLSearchParams(data).toString() : "";

    // Set to undefined since the body property cannot exist on a GET method
    const body = method !== "GET" ? JSON.stringify(data) : undefined;

    const resp = await fetch(url, { method, body, headers });

    // Fetch API does not throw an error, have to dig into the resp for msgs
    if (!resp.ok) {
      console.error("API Error:", resp.statusText, resp.status);
      const { error } = await resp.json();
      throw Array.isArray(error) ? error : [error];
    }

    return await resp.json();
  }

  /** Register a new cat. */
  static async addCat(formData){
    const formSubmission = new FormData();


    for (let key in formData){
      if (key !== "photoProfile"){
        formSubmission.append(key, formData[key]);
      }else{
        formSubmission.append("file", formData[key]);
      }
    }

    const response = await fetch(`${BASE_API_URL}/register`, {
      method: "POST",
      body: formSubmission,
    });

    if (!response.ok) {
      console.error("API Error:", response.statusText, response.status);
      const { error } = await response.json();
      throw Array.isArray(error) ? error : [error];
    }

    const data = await response.json();

    return data;
  }

  static async loginCat(loginData){
    const response = await this.request('logincat', loginData, "POST" );
    return response;
  }

  /** Get all users. */
  static async getCats() {
    const response = await this.request('allcats');

    return response;
  }
}

export default FrienderApi;