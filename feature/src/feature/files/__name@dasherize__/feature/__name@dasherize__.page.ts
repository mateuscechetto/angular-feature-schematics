import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { <%=classify(name)%>Service } from '@<%=dasherize(name)%>/data-access/<%=dasherize(name)%>.service';
@Component({
    selector: 'app-<%=dasherize(name)%>',
    templateUrl: './<%=dasherize(name)%>.page.html',
    imports: [],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class <%=classify(name)%>Page {
    service = inject(<%=classify(name)%>Service);
}