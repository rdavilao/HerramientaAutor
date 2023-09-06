import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Resource } from "app/model/resource.model";
import { ResourceRQ } from "app/model/resourceRQ.model";
import { UrlActivity } from "app/model/urlActivity.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ResourceService {
  private url = "http://localhost:8081/api/activitea/resource";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient) {}

  getPublicResources(): Observable<any> {
    return this.http.get<any>(`${this.url}/puResources`, this.httpOptions);
  }

  getResourcesByOwnerAndType(resourceRq: ResourceRQ): Observable<any> {
    const params = new HttpParams()
      .set("email", resourceRq.emailOwner)
      .set("type", resourceRq.type);
    return this.http.get<any>(`${this.url}/getResources`, { params: params });
  }

  getPublicResourcesByNameLike(name: string): Observable<any> {
    const params = new HttpParams().set("name", name);
    return this.http.get<any>(`${this.url}/getPublicResourcesByNameLike`, {
      params: params,
    });
  }

  getPrivateResourcesByNameLike(name: string, email: string): Observable<any> {
    const params = new HttpParams().set("name", name).set("email", email);
    return this.http.get<any>(`${this.url}/getPrivateResourcesByNameLike`, {
      params: params,
    });
  }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${this.url}/getCategories`, this.httpOptions);
  }

  createResource(
    resource: Resource,
    resourceImg: File,
    resourceAudio: File,
    typeActivity: string,
    activity: any,
    activityFiles: File[]
  ): Observable<any> {
    const formData = new FormData();
    formData.append("jsonData", JSON.stringify(resource));
    formData.append("photo", resourceImg);
    formData.append("sound", resourceAudio);
    formData.append("typeActivity", typeActivity);
    formData.append("activityData", JSON.stringify(activity));
    activityFiles.forEach((file) => {
      formData.append("activityFiles", file, file.name);
    });
    return this.http.post<any>(`${this.url}/create`, formData);
  }

  processFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<any>(`${this.url}/doOCR`, formData);
  }
  /*
    createUser(user: User): Observable<void> {
      return this.http.post<void>(`${this.url}/create`, user, this.httpOptions);
    } 
  
    login(login: LoginRQ): Observable<User> {
      return this.http.post<User>(`${this.url}/login`, login, this.httpOptions);
    }*/
}
