import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ShopsListComponent } from './components/shops/shops-list/shops-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/shared/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/shared/register/register.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PanelComponent } from './components/vendor/panel/panel.component';
import { ProductsListComponent } from './components/vendor/panel/products/products-list/products-list.component';
import { ProductsCreateComponent } from './components/vendor/panel/products/products-create/products-create.component';
import { ProductsEditComponent } from './components/vendor/panel/products/products-edit/products-edit.component';
import { CustomersListComponent } from './components/vendor/panel/customers/customers-list/customers-list.component';
import { ShopCreateComponent } from './components/shops/shop-create/shop-create.component';
import { ShopDetailsComponent } from './components/shops/shop-details/shop-details.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { CategoryListComponent } from './components/shops/categories/category-list/category-list.component';
import { CategoryCreateComponent } from './components/shops/categories/category-create/category-create.component';
import { ShopCategoryComponent } from './components/shops/shop-category/shop-category.component';
import { ShopCProductsComponent } from './components/shops/shop-c-products/shop-c-products.component';
import { CategoryEditComponent } from './components/shops/categories/category-edit/category-edit.component';
import { ProductEditComponent } from './components/shops/categories/products/product-edit/product-edit.component';
import { ProductsListsComponent } from './components/shops/categories/products/products-lists/products-lists.component';
import { ProductCreateComponent } from './components/shops/categories/products/product-create/product-create.component';
import { ExperimentListComponent } from './components/experiments/experiment-list/experiment-list.component';
import { ExperimentCreateComponent } from './components/experiments/experiment-create/experiment-create.component';
import { ExperimentDetailsComponent } from './components/experiments/experiment-details/experiment-details.component';
import { GroupListComponent } from './components/groups/group-list/group-list.component';
import { GroupCreateComponent } from './components/groups/group-create/group-create.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskCreateComponent } from './components/tasks/task-create/task-create.component';
import { TextMaskModule } from 'angular2-text-mask';
import { InterceptorService } from './interceptors/interceptor.service';
import { NgxSpinnerModule } from "ngx-spinner";
import { ArtifactListComponent } from './components/artifacts/artifact-list/artifact-list.component';
import { ArtifactCreateComponent } from './components/artifacts/artifact-create/artifact-create.component';
import { SizeFilePipe } from './pipes/size-file.pipe';
import { BadgesDetailsComponent } from './components/badges/badges-details/badges-details.component';
import { ExperimentersListComponent } from './components/experimenters/experimenters-list/experimenters-list.component';
import { AddExperimenterComponent } from './components/experimenters/add-experimenter/add-experimenter.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { PaperComponent } from './components/evaluation-parameters/paper/paper.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { GroupDetailsComponent } from './components/groups/group-details/group-details.component';
import { ParticipantListComponent } from './components/participants/participant-list/participant-list.component';
import { ParticipantEditComponent } from './components/participants/participant-edit/participant-edit.component';
import { ParticipantCreateComponent } from './components/participants/participant-create/participant-create.component';
import { AttachExperimenterComponent } from './components/experimenters/attach-experimenter/attach-experimenter.component';
import { AccordionComponent } from './ui/accordion/accordion.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ReplacePipe } from './pipes/replace.pipe';
import { ExperimentsOutletComponent } from './components/experiments/experiments-outlet/experiments-outlet.component';
import { ExperimentDashboardComponent } from './components/experiments/experiment-dashboard/experiment-dashboard.component';
import { ExperimentProgressReportComponent } from './components/experiments/experiment-dashboard/experiment-progress-report/experiment-progress-report.component';
import { ExperimentArtifactsReportComponent } from './components/experiments/experiment-dashboard/experiment-artifacts-report/experiment-artifacts-report.component';
import { ExperimentTasksReportComponent } from './components/experiments/experiment-dashboard/experiment-tasks-report/experiment-tasks-report.component';
import { ExperimentGroupsReportComponent } from './components/experiments/experiment-dashboard/experiment-groups-report/experiment-groups-report.component';
import { RefreshButtonComponent } from './ui/refresh-button/refresh-button.component';
import { CustomModalComponent } from './ui/custom-modal/custom-modal.component';
import { ArtifactsInventoryComponent } from './components/evaluation-parameters/artifacts-inventory/artifacts-inventory.component';
import { ReadmeFileComponent } from './components/evaluation-parameters/readme-file/readme-file.component';
import { InstructionGuideDownloadComponent } from './components/evaluation-parameters/instruction-guide-download/instruction-guide-download.component';
import { EditorComponent } from './ui/editor/editor.component';
import { InstructionGuideExecuteComponent } from './components/evaluation-parameters/instruction-guide-execute/instruction-guide-execute.component';
import { AccessibilityFilesDataComponent } from './components/evaluation-parameters/accessibility-files-data/accessibility-files-data.component';
import { SoftwareExecutionResultsComponent } from './components/evaluation-parameters/software-execution-results/software-execution-results.component';
import { SwitchComponent } from './ui/switch/switch.component';
import { SoftwareResultsRegisterComponent } from './components/evaluation-parameters/software-results-register/software-results-register.component';
import { RelevanceArtifactComponent } from './components/evaluation-parameters/relevance-artifact/relevance-artifact.component';
import { CardComponent } from './ui/card/card.component';
import { ButtonIconComponent } from './ui/button-icon/button-icon.component';
import { AuthGuard } from './guards/AuthGuard';
import { InventoryFileComponent } from './components/inventory-file/inventory-file.component';
import { ReadmeDocComponent } from './components/readme-doc/readme-doc.component';
import { NgxPrintModule } from 'ngx-print';
import { ChoiceFileComponent } from './components/evaluation-parameters/choice-file/choice-file.component';
import { ContactFileComponent } from './components/evaluation-parameters/contact-file/contact-file.component';
import { RequirementsFileComponent } from './components/evaluation-parameters/requirements-file/requirements-file.component';
import { StatusFileComponent } from './components/evaluation-parameters/status-file/status-file.component';
import { LicenseFileComponent } from './components/evaluation-parameters/license-file/license-file.component';
import { InstallFileComponent } from './components/evaluation-parameters/install-file/install-file.component';
import { StructuredArtifactsComponent } from './components/evaluation-parameters/structured-artifacts/structured-artifacts.component';
import { NormsStandardsComponent } from './components/evaluation-parameters/norms-standards/norms-standards.component';
import { TypePackageComponent } from './components/evaluation-parameters/type-package/type-package.component';
import { VirtualEnvComponent } from './components/evaluation-parameters/virtual-env/virtual-env.component';
import { RegisterInstallGuideComponent } from './components/evaluation-parameters/register-install-guide/register-install-guide.component';
import { ZipFilesComponent } from './components/evaluation-parameters/zip-files/zip-files.component';
import { MinConfigComponent } from './components/evaluation-parameters/min-config/min-config.component';;
import { LabpackListComponent } from './components/labpack/labpack-list/labpack-list.component';
import { AcmArtifactsCreateComponent } from './components/acm-artifacts/acm-artifacts-create/acm-artifacts-create.component';
import { AcmArtifactsListComponent } from './components/acm-artifacts/acm-artifacts-list/acm-artifacts-list.component';
import { CitationFileComponent } from './components/evaluation-parameters/citation-file/citation-file.component';
import { AuthorFileComponent } from './components/evaluation-parameters/author-file/author-file.component';
import { ReproducedScientificArticleComponent } from './components/evaluation-parameters/reproduced-scientific-article/reproduced-scientific-article.component';
import { ReproducedAuthorsFileComponent } from './components/evaluation-parameters/reproduced-authors-file/reproduced-authors-file.component';
import { AbstractFileComponent } from './components/evaluation-parameters/abstract-file/abstract-file.component';
import { ReproducedCriticSummaryComponent } from './components/evaluation-parameters/reproduced-critic-summary/reproduced-critic-summary.component';
import { ReproducedReflexionsFileComponent } from './components/evaluation-parameters/reproduced-reflexions-file/reproduced-reflexions-file.component';
import { ReproducedNarrativeFileComponent } from './components/evaluation-parameters/reproduced-narrative-file/reproduced-narrative-file.component';
import { JustificationFileComponent } from './components/evaluation-parameters/justification-file/justification-file.component';
import { ScientificArticleReplicatedComponent } from './components/evaluation-parameters/scientific-article-replicated/scientific-article-replicated.component';
import { AbstractArticleReplicatedComponent } from './components/evaluation-parameters/abstract-article-replicated/abstract-article-replicated.component';
import { CriticSummaryReplicatedComponent } from './components/evaluation-parameters/critic-summary-replicated/critic-summary-replicated.component';
import { CriticReflexionsReplicatedComponent } from './components/evaluation-parameters/critic-reflexions-replicated/critic-reflexions-replicated.component';
import { JustificationFileReplicatedComponent } from './components/evaluation-parameters/justification-file-replicated/justification-file-replicated.component';
import { NarrativeFileReplicatedComponent } from './components/evaluation-parameters/narrative-file-replicated/narrative-file-replicated.component';
import { AuthorsFileReplicatedComponent } from './components/evaluation-parameters/authors-file-replicated/authors-file-replicated.component';
import { GroupDetailsOutletComponentComponent } from './components/groups/group-details-outlet-component/group-details-outlet-component.component';
import {StepsModule} from 'primeng/steps';
import { StepMenuComponent } from './components/experiments/step-menu/step-menu.component';
import {MatCardModule} from '@angular/material/card';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {DropdownModule} from 'primeng/dropdown';
import { FileSaverModule } from 'ngx-filesaver';
// Angular material modules
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
// MaterialUI Components
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { LayoutModule } from '@angular/cdk/layout';
import {FlexLayoutModule} from '@angular/flex-layout';
import { SwiperModule } from 'swiper/angular';
import { AboutpageComponent } from './components/shared/aboutpage/aboutpage.component';
import { SliderswiperComponent } from './components/shared/sliderswiper/sliderswiper.component';
import { SliderComponent } from './components/slider/slider.component';
import { ObjetosNavComponent } from './components/materialfolder/objetos-nav/objetos-nav.component';
import { NewLoginComponent } from './components/new-login/new-login.component';
import {PaginatorModule} from 'primeng/paginator';
import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';
import {DividerModule} from 'primeng/divider';
import {ChartModule} from 'primeng/chart';
import {KnobModule} from 'primeng/knob';
import { AutomaticParameterComponent } from './components/evaluation-parameters/automatic-parameter/automatic-parameter.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangeNewpasswordComponent } from './components/change-newpassword/change-newpassword.component';
import { DescriptionSoftwareComponent } from './components/evaluation-parameters/description-software/description-software.component';
import { DescriptionScriptComponent } from './components/evaluation-parameters/description-script/description-script.component';
import { HelpMenuComponent } from './components/help-menu/help-menu.component';
import { PersonalSettingsComponent } from './components/personal-settings/personal-settings.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { UserGuideStepperComponent } from './components/user-guide-stepper/user-guide-stepper.component';
import { InputTimeComponent } from './components/generic/input-time/input-time.component';
import { MessageBtnComponent } from './components/message-btn/message-btn.component'
import {DialogModule} from 'primeng/dialog';
import { UploadPackageComponent } from './components/upload-package/upload-package.component';
import { SelectBadgeComponent } from './components/select-badge/select-badge.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locales/', '.json');
}

const MaterialUIElements=[
  MatCheckboxModule,
  MatButtonModule,
  MatInputModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
  MatStepperModule,
  MatTabsModule,
  MatExpansionModule,
  MatButtonToggleModule,
  MatChipsModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatDialogModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
]

@NgModule({
  declarations: [
    AppComponent,
    ShopsListComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    PanelComponent,
    ProductsListComponent,
    ProductsCreateComponent,
    ProductsEditComponent,
    CustomersListComponent,
    ShopCreateComponent,
    ShopDetailsComponent,
    CategoryListComponent,
    CategoryCreateComponent,
    ShopCategoryComponent,
    ShopCProductsComponent,
    CategoryEditComponent,
    ProductEditComponent,
    ProductsListsComponent,
    ProductCreateComponent,
    ExperimentsOutletComponent,
    ExperimentListComponent,
    ExperimentCreateComponent,
    ExperimentDetailsComponent,
    GroupListComponent,
    GroupCreateComponent,
    TaskListComponent,
    TaskCreateComponent,
    ArtifactListComponent,
    ArtifactCreateComponent,
    SizeFilePipe,
    ReplacePipe,
    BadgesDetailsComponent,
    ExperimentersListComponent,
    AddExperimenterComponent,
    PaperComponent,
    FooterComponent,
    GroupDetailsComponent,
    ParticipantListComponent,
    ParticipantEditComponent,
    ParticipantCreateComponent,
    AttachExperimenterComponent,
    AccordionComponent,
    ExperimentDashboardComponent,
    ExperimentProgressReportComponent,
    ExperimentArtifactsReportComponent,
    ExperimentTasksReportComponent,
    ExperimentGroupsReportComponent,
    RefreshButtonComponent,
    ArtifactsInventoryComponent,
    CustomModalComponent,
    ReadmeFileComponent,
    InstructionGuideDownloadComponent,
    EditorComponent,
    InstructionGuideExecuteComponent,
    AccessibilityFilesDataComponent,
    SoftwareExecutionResultsComponent,
    SwitchComponent,
    SoftwareResultsRegisterComponent,
    RelevanceArtifactComponent,
    CardComponent,
    ButtonIconComponent,
    InventoryFileComponent,
    ReadmeDocComponent,
    ChoiceFileComponent,
    ContactFileComponent,
    RequirementsFileComponent,
    StatusFileComponent,
    LicenseFileComponent,
    InstallFileComponent,
    StructuredArtifactsComponent,
    NormsStandardsComponent,
    TypePackageComponent,
    VirtualEnvComponent,
    RegisterInstallGuideComponent,
    ZipFilesComponent,
    MinConfigComponent,
    LabpackListComponent,
    AcmArtifactsCreateComponent,
    AcmArtifactsListComponent,
    CitationFileComponent,
    AuthorFileComponent,
    ReproducedScientificArticleComponent,
    ReproducedAuthorsFileComponent,
    AbstractFileComponent,
    ReproducedCriticSummaryComponent,
    ReproducedReflexionsFileComponent,
    ReproducedNarrativeFileComponent,
    JustificationFileComponent,
    ScientificArticleReplicatedComponent,
    AbstractArticleReplicatedComponent,
    CriticSummaryReplicatedComponent,
    CriticReflexionsReplicatedComponent,
    JustificationFileReplicatedComponent,
    NarrativeFileReplicatedComponent,
    AuthorsFileReplicatedComponent,
    GroupDetailsOutletComponentComponent,
    StepMenuComponent,
    AboutpageComponent,
    SliderswiperComponent,
    SliderComponent,
    ObjetosNavComponent,
    NewLoginComponent,
    AutomaticParameterComponent,
    ForgotPasswordComponent,
    ChangeNewpasswordComponent,
    DescriptionSoftwareComponent,
    DescriptionScriptComponent,
    HelpMenuComponent,
    PersonalSettingsComponent,
    UserGuideComponent,
    UserGuideStepperComponent,
    InputTimeComponent,
    MessageBtnComponent,
    UploadPackageComponent,
    SelectBadgeComponent,
  ],
  imports: [
    CommonModule,
    NgxPrintModule,
    SidebarModule,
    ButtonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PaginatorModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    NgxPaginationModule,
    TextMaskModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    AutocompleteLibModule,
    ...MaterialUIElements,
    SwiperModule,
    FlexLayoutModule,
    CascadeSelectModule,
    StepsModule,
    FileSaverModule,
    PanelModule,
    CardModule,
    DividerModule,
    DialogModule,
    ChartModule,
    KnobModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en-us',
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),

  ],
  providers: [
    BsModalService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
