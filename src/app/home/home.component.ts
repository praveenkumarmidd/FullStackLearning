import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeProfile } from '@app/_models';
import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/internal/operators/first';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    employeeProfile: EmployeeProfile = new EmployeeProfile;
    form: FormGroup;
    submitted = false;
    returnUrl: string;
    user: User;
    loading = false;
    hide:boolean=false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private accountService: AccountService,
        ) {
            this.user = this.accountService.userValue;
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            phnumber: ['', Validators.required]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    get f() { return this.form.controls; }
    onSubmit()
    {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.accountService.getUserName(this.f.name.value, this.f.phnumber.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.employeeProfile= data;
                    this.loading = false;
                    this.hide=true;
                },
                error => {
                    this.hide=false;
                    this.alertService.error('Record Not Found');
                });
    }
}