import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent {
  @Input() start_show?: boolean = false;
  show = false;
  accordion_id = 'accordion-';
  collapsable_id = 'collapsable-';
  accordion_header_id = 'accordion-header-';

  constructor() {}
  ngOnInit() {
    this.show = this.start_show ?? false;
    this.accordion_id += Math.round(Math.random() * 1000);
    this.collapsable_id += Math.round(Math.random() * 1000);
    this.accordion_header_id += Math.round(Math.random() * 1000);
  }

  toggle() {
    this.show = !this.show;
  }
}
