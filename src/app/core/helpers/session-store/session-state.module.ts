import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionStateComponent } from './session-state.component';



@NgModule({
  declarations: [SessionStateComponent],
  imports: [
    CommonModule
  ],
  exports: [SessionStateComponent]
})
export class SessionStateModule { }
