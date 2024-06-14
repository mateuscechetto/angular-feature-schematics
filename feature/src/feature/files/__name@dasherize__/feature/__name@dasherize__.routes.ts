import { Routes } from "@angular/router";
import { <%=classify(name)%>Page } from "@<%=dasherize(name)%>/feature/<%=dasherize(name)%>.page";

export const <%=toUpperCase(underscore(name))%>_ROUTES: Routes = [
    {
        path: '',
        component: <%=classify(name)%>Page
    },
];