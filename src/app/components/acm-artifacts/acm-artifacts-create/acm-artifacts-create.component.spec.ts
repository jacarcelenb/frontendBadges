import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AcmArtifactsCreateComponent } from './acm-artifacts-create.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ArtifactService } from 'src/app/services/artifact.service';
describe('AcmArtifactsCreateComponent', () => {
  let component: AcmArtifactsCreateComponent;
  let fixture: ComponentFixture<AcmArtifactsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })],
      declarations: [AcmArtifactsCreateComponent],
      providers: [
        TranslateService,
        ArtifactService,
        FormBuilder
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmArtifactsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  // The component should initialize without errors

});
