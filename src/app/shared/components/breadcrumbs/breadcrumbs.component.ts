import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule,BreadcrumbComponent,BreadcrumbItemDirective,MatIconModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss'
})
export class BreadcrumbsComponent {
 

}


