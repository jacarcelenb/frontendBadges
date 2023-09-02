import { randomUUId } from "./generators";

export function parseArtifactNameForStorage(artifact_name: string) {
	let [, extension] = /(?:\.([^.]+))?$/.exec(artifact_name);
	let file_name = extension ?
		artifact_name
			.split('.')
			.slice(0, -1)
			.join('.')
		: artifact_name;

	const time_stamp = new Date().getTime().toString();
	return file_name.concat('_').concat(time_stamp);
}

const artifactTypes = {
	artifact: 'artifact-',
	article: 'article-',
	inventary: 'inventary-',
	report: 'report-',
	guide: 'guide-',
	result: 'result-',
	repository: 'repository-',
	image: 'image'
};

type ArtifactType = keyof typeof artifactTypes;

export function newStorageRefForArtifact(type: ArtifactType, artifact_name: string) {

	const artifact_folder = artifactTypes[type] + randomUUId();
	let storage_ref = ""
	if (artifactTypes[type] === 'image') {
		 storage_ref= `Image/${artifact_folder}/${artifact_name}`;
	}
	else {
		storage_ref = `Artifacts/${artifact_folder}/${artifact_name}`;
	}
	return storage_ref;
}