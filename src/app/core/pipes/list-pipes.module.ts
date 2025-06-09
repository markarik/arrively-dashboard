import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateConvertPipe } from './date-converter/date-convert.pipe';
import { StringTrancatePipe } from './string/string-trancate.pipe';




@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,

    DateConvertPipe,
    StringTrancatePipe,
  ],
  exports: [
    DateConvertPipe,
    StringTrancatePipe,

   

  ]
})
export class ListPipesModule { }
