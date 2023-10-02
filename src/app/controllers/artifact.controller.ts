import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { TranslateService } from "@ngx-translate/core";
import { finalize } from "rxjs/operators";
import { AlertService } from "../services/alert.service";
import { ArtifactService } from "../services/artifact.service";

@Injectable({
  providedIn: 'root',
})
export class ArtifactController {
	private experiment_id: string;
	constructor(
		private artifactService: ArtifactService,
		private afStorage: AngularFireStorage,
		private alertService: AlertService,
		private translateService: TranslateService,
	) {}

	init(experiment_id: string) {
		this.experiment_id = experiment_id;
	}
	removeFullArtifact(artifact_id: number, callbackDone) {
		const onSuccessfulDelete = () => {
			this.alertService.presentSuccessAlert(
				this.translateService.instant('MSG_OPERATION'),
			);
			callbackDone();
		};
		const onErrorDelete = () => {
			this.alertService.presentErrorAlert(
				this.translateService.instant('ARTIFACT_DELETE_FAILURE'),
			);
			callbackDone();
		};

		const deleteArtifact = async (artifact) => {
			await Promise.all([
				this.afStorage.storage.ref(artifact.file_location_path).delete(),
        this.artifactService.delete(artifact._id).toPromise()
			])
			.catch(onErrorDelete)
			.then(onSuccessfulDelete);
		};

		this.artifactService.get({ _id: artifact_id })
			.subscribe(async (data: any) => {
        if (data.response.length > 0) {
          await deleteArtifact(data.response[0]);
        }
			}, onErrorDelete);
	}
	uploadArtifactToStorage(
		storage_ref,
		data,
		{ onPercentageChanges },
		callbackDone: (storage_ref: string, url: string) => void,
	) {
		const fileRef = this.afStorage.ref(storage_ref);
    const uploadTask = this.afStorage.upload(
      storage_ref,
      data
    );

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
						callbackDone(storage_ref, url);
          });
        })
      )
      .subscribe();
    uploadTask.percentageChanges().subscribe((value) => {
			onPercentageChanges(value.toFixed(0));
    });
	}


	deleteUploadImage(urlimage){
     this.afStorage.storage.ref(urlimage).delete()
	}
}