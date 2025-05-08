# digital banking app

## Overview

- this project is the front end of digital banking application.
- this project is made for educational purposes with angular framework.
- the documentation will explain the basic concepts of angular framework.

## Angular

- what angular does is it create a single page application, at the build phase it gather the whole page and components into a single page which is index.html.

### Component

- we can create a component by simply typing.

```
ng g c component-name
```

- in `index.html` we use a component called `app-root` which is the selector name of the `app-component`. however, in the app component we can call another component by their selector name as well.

```html
<!-- app-root component (app-component) -->
<app-navbar></app-navbar>
<router-outlet></router-outlet>
```

- every component has four files but the are focusing only on two, the html and the typescript files.
- the typescipt file of the component holds all the attributes the service which will be responsible for the business layer of the app.
- the attributes in the ts component and html component use data binding, which the html to rerender whenever they change.

```ts
// example customers.ts
@Component({
  selector: "app-customers",
  standalone: false,
  templateUrl: "./customers.component.html",
  styleUrl: "./customers.component.css",
})
export class CustomersComponent implements OnInit {
  customers!: Observable<Array<Customer>>;
  errorMessage!: string;
  searchFormGroup!: FormGroup;
  constructor(private customerService: CustomerService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(""),
    });
    this.handleSearchCustomers();
  }

  handleSearchCustomers() {
    let keyword = this.searchFormGroup.value.keyword;
    this.customers = this.customerService.searchCustomers(keyword).pipe(
      catchError((err) => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }
}
```

```html
<!-- a chunk from customers.html -->
<table class="table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let c of customers | async">
      <td>{{c.id}}</td>
      <td>{{c.name}}</td>
      <td>{{c.email}}</td>
      <td>
        <button (click)="handleDeleteCustomer(c)" class="btn btn-danger">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  </tbody>
</table>
```

### Service

- we can create the service by the command.

```
ng g s service-name
```

- the service contains the business logic, like api calls for example. we use the service by injecting in the the component constructor.
- we can inject the same service in many component.
- we inject other services in the service such as `HttpClient`.
```ts
// example code of a service
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getAllCustomers(): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(environment.backendHost + '/customers');
  }
}
```
```ts
// the component
...
export class CustomersComponent implements OnInit {
  ...
  constructor(private customerService: CustomerService, private fb: FormBuilder) { }
  ...
}
```

### Forms

- the first thing we do when we want to work with forms in angular is to import `ReactFormsModule` in `app.module.ts`

```ts
imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
],
```

- then we create a variable of type `FormGroup` in the corresponding component.
- then we inject a service in the constructor of the component called `FormBuilder`

```ts
export class CustomersComponent implements OnInit {
  formGroup: FormGroup | undefined;
  constructor(private customerService: CustomerService, private fb: FormBuilder) {}
}
```

- then we define the form fields in a form builder group.

```ts
this.formGroup = this.fb.group({
  keyword: this.fb.control(""),
});
```

- then we define the form in the html component

```html
<form [formGroup]="searchFormGroup" (ngSubmit)="handleSearchCustomers()">...</form>
```

- the method `handleSearchCustomers()` in the `component.ts` will be executed after submiting the form.
- the variable `searchFormGroup` must not be undefined in the declaration, else we can verify with `*ngIf`.
- the `searchFormGroup` is an object that contain all the fields of the form, it saves the data of the attributes in the form, we use it to initialize the fields and we will use it later to retrieve the fields as well.

```ts
// initialize the fields
ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
    keyword: this.fb.control("")
    });
}
// retrieve the data of the fields
handleSearchCustomers() {
    let keyword = this.searchFormGroup.value.keyword;
}
```

- most of the times we got fields which are required or has certain validation rules, we can apply the validation rules using the control method of formBuilder object of the form in the component, by adding an array of the validators.

```ts
ngOnInit(): void {
    this.newCustomerFormGroup = this.fb.group({
        name: this.fb.control("", [Validators.required, Validators.minLength(5)]),
        email: this.fb.control("", [Validators.required, Validators.email])
    });
}
```

- in html component we add an attribute `[disabled]` with the condition of validation to the submit button

```ts
<button [disabled]="!newCustomerFormGroup.valid" class="btn btn-info">Save</button>
```

- when the rules of validations aren't respected the `errors` get binded into an object inside `formGroup` which is `formGroup.controls['nameOfField'].errors` and inside the errors we can get the errors of each `validator`.

```ts
<div class="mb-3">
    <label class="form-label">Email:</label>
    <input type="text" formControlName="email" class="form-control">
    <ng-container *ngIf="newCustomerFormGroup.controls['email'].touched && newCustomerFormGroup.controls['email'].errors">
        <ng-container *ngIf="newCustomerFormGroup.controls['email'].errors!['required']">
            <span class="text-danger">Email is required</span>
        </ng-container>
        <ng-container *ngIf="newCustomerFormGroup.controls['email'].errors!['email']">
            <span class="text-danger">Email is not valid</span>
        </ng-container>
    </ng-container>
</div>
```

- after deleting the customer we can either reset the text fields or navigate to the customers page.
- the navigation need to import the router and inject it as a service in the constructor.

```ts
import { Router } from '@angular/router';
constructor(private customerService: CustomerService, private fb: FormBuilder, private router: Router) { }

handleSaveCustomer() {
    let customer = this.newCustomerFormGroup.value;
    this.customerService.saveCustomer(customer).subscribe({
        next: (data) => {
            alert('customer has been saved successfully');
            // reset the fields
            this.newCustomerFormGroup.reset();
            // or navigate to customers
            this.router.navigateByUrl("/customers");
        },
            error: (error) => {
            console.log(error);
        }
    });
}
```
