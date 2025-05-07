# forms

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

