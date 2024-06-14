import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class <%=classify(name)%>Service {
    http = inject(HttpClient);
}