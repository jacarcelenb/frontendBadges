import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalComponent } from 'src/app/ui/custom-modal/custom-modal.component';

@Component({
  selector: 'app-relevance-artifact',
  templateUrl: './relevance-artifact.component.html',
  styleUrls: ['./relevance-artifact.component.scss']
})
export class RelevanceArtifactComponent implements OnInit {
  standard_name = "relevancia_artefacto";
  @Input() experiment_id: number;
  @ViewChild(CustomModalComponent) modal!: CustomModalComponent;
  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();
  
  isLoading: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
