import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class BadgesCalculationsService {

  constructor() { }
  /**
   *
   * @param totalParameter  total de parametros de la insignia      TP
   * @param conditionedParameters total de parametros condicionados PC
   * @param requiredParameters total de parametros requeridos       PR
   */
  calculateBadgesWeigths(totalParameter: any, conditionedParameters: any,
    requiredParameters: any) {

    return (((requiredParameters) / (totalParameter - conditionedParameters)) / requiredParameters) * 100

  }
  /**
   * Retorna el total de parametros de la insignia que estén relacionados
     con el software o scripts
   */
  findParametersWithOutSoftwareScript(listParameters: any, idStandardOptional) {
    let countNumParameters = 0
    for (let index = 0; index < listParameters.length; index++) {
      if (listParameters[index].standard_feature.conditioned == false &&
        listParameters[index].standard_type != idStandardOptional) {
        countNumParameters += 1
      }
    }
    return countNumParameters
  }

  findParametersWithOutConfidentialAccess(listParameters: any, idStandardOptional) {
    let countNumParameters = 0
    for (let index = 0; index < listParameters.length; index++) {
      if (listParameters[index].standard_feature.type != "Registro de acceso confidencial" &&
        listParameters[index].standard_type != idStandardOptional) {
        countNumParameters += 1
      }
    }

    return countNumParameters
  }

  findScriptParameters(listParameters: any, idStandardOptional) {
    let countNumParameters = 0
    for (let index = 0; index < listParameters.length; index++) {
      if (listParameters[index].standard_feature.type == "Script" &&
        listParameters[index].standard_type != idStandardOptional) {
        countNumParameters += 1
      }
    }

    return countNumParameters
  }

  findSoftwareParameters(listParameters: any, idStandardOptional) {
    let countNumParameters = 0
    for (let index = 0; index < listParameters.length; index++) {
      if (listParameters[index].standard_feature.type == "Software" &&
        listParameters[index].standard_type != idStandardOptional) {
        countNumParameters += 1
      }
    }

    return countNumParameters
  }

  findSourceCodeParameters(listParameters: any, idStandardOptional) {
    let countNumParameters = 0
    for (let index = 0; index < listParameters.length; index++) {
      if (listParameters[index].standard_feature.type == "CodigoFuente" &&
        listParameters[index].standard_type != idStandardOptional) {
        countNumParameters += 1
      }
    }

    return countNumParameters
  }

  findRequiredParameters(listParameters: any, idStandardOptional) {
    let countNumParameters = 0
    for (let index = 0; index < listParameters.length; index++) {
      if (listParameters[index].standard_type != idStandardOptional) {
        countNumParameters += 1
      }
    }

    return countNumParameters
  }
  CalculateFuncionalParameterValue(experiment: any, listParameters: any, idStandardOptional): number {
    let parameter_value = 0
    let totalParameters = 0
    let conditionedParameters = 0
    let requiredParameters = 0
    //  PP1
    if (experiment[0].has_scripts == true && experiment[0].has_software == true) {
      totalParameters = this.findRequiredParameters(listParameters, idStandardOptional)
      conditionedParameters = 0
      requiredParameters = totalParameters

      parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters,
        requiredParameters)
    }
    // PP2
    else if (experiment[0].has_scripts == false && experiment[0].has_software == false) {
      totalParameters = this.findParametersWithOutSoftwareScript(listParameters, idStandardOptional)
      conditionedParameters = 0
      requiredParameters = totalParameters
      parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters,
        requiredParameters)
    }
    //  PP3 experimento solo con scripts y no registra software
    else if (experiment[0].has_scripts == true && experiment[0].has_software == false) {
      totalParameters = this.findRequiredParameters(listParameters, idStandardOptional)
      conditionedParameters = this.findScriptParameters(listParameters, idStandardOptional)
      requiredParameters = totalParameters
      parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters,
        requiredParameters)

    }
    //  PP3 experimento solo con software y no registra scripts
    else if (experiment[0].has_scripts == false && experiment[0].has_software == true) {
      totalParameters = this.findRequiredParameters(listParameters, idStandardOptional)
      conditionedParameters = this.findSoftwareParameters(listParameters, idStandardOptional)
      requiredParameters = totalParameters
      parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters,
        requiredParameters)
    }

    return parseFloat(parameter_value.toFixed(2));
  }


  CalculateReusableParemeterValue(experiment: any, listParameters: any, idStandardOptional): number {
    let totalParameters = 0
    let conditionedParameters = 0
    let requiredParameters = 0
    let reusable_parameter_value = 0;
    // caso PP1 de la insignia reutilizable
    if (experiment[0].has_scripts == true && experiment[0].has_software == true && experiment[0].has_source_code == true) {
      totalParameters = this.findRequiredParameters(listParameters, idStandardOptional)
      conditionedParameters = 0
      requiredParameters = totalParameters
      reusable_parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters, requiredParameters)
    }
    else if (experiment[0].has_scripts == true && experiment[0].has_software == true && experiment[0].has_source_code == false) {
      totalParameters = this.findRequiredParameters(listParameters, idStandardOptional)
      conditionedParameters = 0
      requiredParameters = totalParameters
      reusable_parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters, requiredParameters)
    }
    // caso PP2 de la insignia reutlizable
    else if (experiment[0].has_scripts == false && experiment[0].has_software == false && experiment[0].has_source_code == false) {
      totalParameters = this.findParametersWithOutSoftwareScript(listParameters, idStandardOptional)
      conditionedParameters = 0
      requiredParameters = totalParameters
      reusable_parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters, requiredParameters)
    }
    // caso PP3 de la insignia reutlizable se registra o no scripts
    else if (experiment[0].has_scripts == true && experiment[0].has_software == false && experiment[0].has_source_code == false) {
      totalParameters = this.findRequiredParameters(listParameters, idStandardOptional)
      conditionedParameters = this.findScriptParameters(listParameters, idStandardOptional)
      requiredParameters = totalParameters
      reusable_parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters, requiredParameters)
    }

    // caso PP4 de la insignia reutlizable se registra o no software
    else if (experiment[0].has_software == true && experiment[0].has_scripts == false && experiment[0].has_source_code == false) {
      totalParameters = this.findRequiredParameters(listParameters, idStandardOptional)
      conditionedParameters = this.findSoftwareParameters(listParameters, idStandardOptional)
      requiredParameters = totalParameters
      reusable_parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters, requiredParameters)
    }

    // caso PP5 de la insignia reutlizable
    else if (experiment[0].has_software == false && experiment[0].has_scripts == false && experiment[0].has_source_code == true) {
      totalParameters = this.findRequiredParameters(listParameters, idStandardOptional)
      conditionedParameters = this.findSourceCodeParameters(listParameters, idStandardOptional)
      requiredParameters = totalParameters
      reusable_parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters, requiredParameters)
    }
    return parseFloat(reusable_parameter_value.toFixed(2))
  }


  CalculateAvalaibleParemeterValue(numArtifacstWithCredentials: number, listParameters: any, idStandardOptional) {
    let disponible_parameter_value = 0
    let totalParameters = 0
    let conditionedParameters = 0
    let requiredParameters = 0

    if (numArtifacstWithCredentials > 0) {
      totalParameters = this.findRequiredParameters(listParameters, idStandardOptional)
      conditionedParameters = 0
      requiredParameters = totalParameters
      disponible_parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters, requiredParameters)
    } else {
      totalParameters = this.findParametersWithOutConfidentialAccess(listParameters, idStandardOptional)
      conditionedParameters = 0
      requiredParameters = totalParameters
      disponible_parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters, requiredParameters)
    }
    return parseFloat(disponible_parameter_value.toFixed(2))
  }


  CalculateReproducedParameterValue(listParameters: any, idStandardOptional): number {
    let parameter_value = 0
    let totalParameters = 0
    let conditionedParameters = 0
    let requiredParameters = 0
    //  PP1
    totalParameters = this.findRequiredParameters(listParameters, idStandardOptional)
    conditionedParameters = 0
    requiredParameters = totalParameters
    parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters,
      requiredParameters)

    return parseFloat(parameter_value.toFixed(2));
  }

  CalculateReplicatedParameterValue(listParameters: any, idStandardOptional): number {
    let parameter_value = 0
    let totalParameters = 0
    let conditionedParameters = 0
    let requiredParameters = 0
    //  PP1
    totalParameters = this.findRequiredParameters(listParameters, idStandardOptional)
    conditionedParameters = 0
    requiredParameters = totalParameters
    parameter_value = this.calculateBadgesWeigths(totalParameters, conditionedParameters,
      requiredParameters)

    return parseFloat(parameter_value.toFixed(2));
  }




  /**
   * Calcular el total de los software que tienen descripcion sistematica
   */
  calculateSoftwareTotal(numtotalSoftware, numdescription_Software, value_param): number {
    let value = 0
    let resp = 0
    if (numtotalSoftware > 0) {
      value = numdescription_Software / numtotalSoftware
      resp = value_param * value
    }
    return resp;
  }

  /**
   * Calcular el total de los software que tienen descripcion sistematica
   */

  calculateScripstTotal(numtotalScripts, numdescription_Scripts, value_param): number {
    let value = 0
    let resp = 0
    if (numtotalScripts > 0) {
      value = numdescription_Scripts / numtotalScripts
      resp = value_param * value
    }
    return resp;
  }

  /**
   * Calcular el total de los scripts ejecutados
   */
  calculateScripstExecutedTotal(numtotalScripts, numExecScripts, value_param): number {
    let value = 0
    let resp = 0
    if (numtotalScripts > 0) {
      value = numExecScripts / numtotalScripts
      resp = value_param * value
    }
    return resp
  }

  /**
   * Calcular el total de los software ejecutados
   */

  calculateExecutedSoftwareTotal(numtotalSoftware, numExecSoftware, value_param): number {
    let value = 0
    let resp = 0
    if (numtotalSoftware > 0) {
      value = numExecSoftware / numtotalSoftware
    }
   return value_param * value
  }

  /**
   * Calcular el total de los artefactos del nivel procedimental
   * @param numTasksArtifactProcedural // total de artefacto del nivel procedimental que necesitan tareas
   * @param numTasksNeedsArtifactrocedural // artefactos procedimental con tareas
   * @param value_param
   * @returns
   */
  calculateNumArtifactProcedural(numTasksArtifactProcedural, numTasksNeedsArtifactrocedural, value_param): number {
    let value = 0
    let resp = 0
    if (numTasksNeedsArtifactrocedural > 0) {
      value = numTasksArtifactProcedural / numTasksNeedsArtifactrocedural
      resp = value * value_param
    }
    return resp
  }

  /**
   * Calcular el total de los artefactos del nivel operacional
   * @param numTasksArtifactOperational // Número de las tareas con artefactos del nivel operacional
   * @param numTasksNeedsArtifactOperational // Total de tareas que necesitan artefactos del nivel operacional
   * @param value_param
   * @returns
   */
  calculateNumArtifactOperational(numTasksArtifactOperational, numTasksNeedsArtifactOperational, value_param) {
    let value = 0
    let resp = 0
    if (numTasksNeedsArtifactOperational > 0) {
      value = numTasksArtifactOperational / numTasksNeedsArtifactOperational
      resp = value * value_param
    }
    return resp
  }

  /**
   * Calcular el total de los artefactos del nivel descriptivo
   * @param numTasksArtifactDescriptive // total de artefacto del nivel descriptivo que con tareas
   * @param numTasksNeedsArtifactDescriptive // // total de tareas que necesitan artefactos del nivel descriptivo
   * @param value_param
   * @returns
   */
  calculateNumArtifactDescriptive(numTasksArtifactDescriptive, numTasksNeedsArtifactDescriptive, value_param) {
    let value = 0
    let resp = 0
    if (numTasksNeedsArtifactDescriptive > 0) {
      value = numTasksArtifactDescriptive / numTasksNeedsArtifactDescriptive
      resp = value * value_param
    }
    return resp
  }

  /**
   * Calcular el número de tareas que necesitan artefactos
   * @param numtasksWithArtifacts // numero total de tareas con artefactos
   * @param numtasksNeedsArtifacts // numero de tareas que necesitan artefactos
   * @param num_parameter
   * @returns
   */
  calculateRelevantTask(numtasksWithArtifacts, numtasksNeedsArtifacts, num_parameter): number {
    let value = 0
    let resp = 0
    if (numtasksNeedsArtifacts > 0) {
      value = numtasksWithArtifacts / numtasksNeedsArtifacts;
      resp = value * num_parameter

    }
    return resp
  }


  /**
   * Calcular el numero de los datoa manipulados
   * @param totalData // total de datos // numero de artefactos registrados
   * @param totalDataManipulated // total de datos manipulados
   * @param value_param
   * @returns
   */
  calculatetotalDataManipulation(totalData, totalDataManipulated, value_param): number {
    let value = 0
    let resp = 0


    if (totalData > 0) {
      value = totalDataManipulated / totalData
      resp = value * value_param
    }
    return resp
  }

  /**
   * Calcular el numero de los datos accesibles
   * @param TotalData // total de datos // numero de artefactos registrados
   * @param TotalAccesibleData / total de datos accesibles
   * @param value_param
   * @returns
   */
  calculatetotalDataAccesiblity(TotalData, TotalAccesibleData, value_param): number {
    let value = 0
    let resp = 0
    if (TotalData > 0) {
      value = TotalAccesibleData / TotalData
      resp = value * value_param
    }
    return resp
  }

  /**
   * Calcular el numero de artefactos que respetan las normas y estandares
   * @param total_norm_standards // total de normas y estandares
   * @param true_norm_standards // total de artefactos que respetan las normas y estandares
   * @param parameter_value
   * @returns
   */
  calculateNormsStandards(total_norm_standards, true_norm_standards, parameter_value): number {
    let value = 0
    let resp = 0
    if (total_norm_standards > 0) {
      value = true_norm_standards / total_norm_standards
      resp = value * parameter_value
    }
    return resp
  }

  /**
   *El siguiente metodo permite comprueba si existen artefactos con
    tiempo de ejecucion completa
   * @param artifacts lista de artefactos
   */
  calculateCompletedTime(artifacts): boolean {
    let validated_paramete = false;
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].evaluation.time_complete_execution != null
        || artifacts[index].evaluation.time_complete_execution != "0:00:00") {
        counter = counter + 1;
      }
    }

    if (counter > 0) {
      validated_paramete = true;
    }

    return validated_paramete
  }


  /**
   * El siguiente metodo permite comprueba si existen artefactos con
   * tiempo de ejecucion corta
   * @param artifacts lista de artefactos
   * @returns
   */

  calculateShortTime(artifacts): boolean {
    let validated_paramete = false;
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].evaluation.time_short_execution != null
        || artifacts[index].evaluation.time_short_execution != "0:00:00") {
        counter = counter + 1;
      }
    }

    if (counter > 0) {
      validated_paramete = true;
    }

    return validated_paramete
  }

  /**
   * Calcular el total de artefactos con marco de tolerancia
   * para la insignia reproducida
   * @param artifacts
   * @returns
   */
  totalFrameworkTolerance(artifacts): number {
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].reproduced.tolerance_framework_reproduced == true) {
        counter += 1;
      }

    }
    return counter
  }

  /**
   * Numero de artefactos con marco de tolerancia para la insignia reproducida
   * @param artifacts
   * @returns
   */
  numFrameworkTolerance(artifacts): number {
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].reproduced.tolerance_framework_reproduced == true) {
        counter += 1;
      }

    }
    return counter
  }

  /**
   * Calcular el total de artefactos con pruebas substanciales
   * para la insignia reproducida
   * @param artifacts
   * @returns
   */
  totalSubstantialEvidence(artifacts): number {
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].reproduced.substantial_evidence_reproduced == true) {
        counter += 1;
      }

    }
    return counter
  }

  /**
   * Numero de artefactos con pruebas sustanciales para la insignia reproducida
   * @param artifacts
   * @returns
   */
  numSubstantialEvidence(artifacts): number {
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].reproduced.substantial_evidence_reproduced == true) {
        counter += 1;
      }

    }
    return counter
  }


  /**
* Calcular el total de artefactos con respeto a la reproduccion
* para la insignia reproducida
* @param artifacts
* @returns
*/
  totalRespectsReproduction(artifacts): number {
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].reproduced.respects_reproduction == true) {
        counter += 1;
      }

    }
    return counter
  }

  /**
   * Numero de artefactos con pruebas sustanciales para la insignia reproducida
   * @param artifacts
   * @returns
   */
  numRespectsReproduction(artifacts): number {
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].reproduced.respects_reproduction == true) {
        counter += 1;
      }

    }
    return counter
  }



  /**
   * Calcular el total de artefactos con marco de tolerancia
   * para la insignia replicada
   * @param artifacts
   * @returns
   */
  totalReplicatedTolerance(artifacts): number {
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].replicated.tolerance_framework_replicated == true) {
        counter += 1;
      }

    }
    return counter
  }

  /**
   * Numero de artefactos con marco de tolerancia para la insignia replicada
   * @param artifacts
   * @returns
   */
  numToleranceReplicated(artifacts): number {
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].replicated.tolerance_framework_replicated == true) {
        counter += 1;
      }

    }
    return counter
  }

  /**
   * Calcular el total de artefactos con pruebas substanciales
   * para la insignia replicada
   * @param artifacts
   * @returns
   */
  totalSubstantialReplicated(artifacts): number {
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].replicated.substantial_evidence_replicated == true) {
        counter += 1;
      }

    }
    return counter
  }

  /**
   * Numero de artefactos con pruebas sustanciales para la insignia replicada
   * @param artifacts
   * @returns
   */
  numSubstantialReplicated(artifacts): number {
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].replicated.substantial_evidence_replicated == true) {
        counter += 1;
      }

    }
    return counter
  }


  /**
* Calcular el total de artefactos con respeto a la replicacion
* para la insignia replicada
* @param artifacts
* @returns
*/
  totalRespectsReplication(artifacts): number {
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].replicated.respects_replication == true) {
        counter += 1;
      }

    }
    return counter
  }

  /**
   * Numero de artefactos con pruebas sustanciales para la insignia replicada
   * @param artifacts
   * @returns
   */
  numRespectsReplication(artifacts): number {
    let counter = 0;
    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].replicated.respects_replication == true) {
        counter += 1;
      }

    }
    return counter
  }

  /**
   * Calcular artefactos con pruebas substanciales
   */
  CalculateSubstantialArtifacts(artifacts): number {
    let value = 0;
    if (this.totalSubstantialEvidence(artifacts) > 0) {
      value = this.numSubstantialEvidence(artifacts) / this.totalSubstantialEvidence(artifacts);
    }
    return value;
  }

  /**
   * Calcular la tolerancia de los artefactos reproducidos
   */

  CalculateToleranceArtifacts(artifacts): number {
    let value = 0;
    if (this.totalFrameworkTolerance(artifacts)) {
      value = this.numFrameworkTolerance(artifacts) / this.totalFrameworkTolerance(artifacts);
    }
    return value;
  }

  /**
   * Calcular el respeto de los artefactos reproducidos
   */
  CalculateRespectReproducedArtifacts(artifacts): number {
    let value = 0;
    if (this.totalRespectsReproduction(artifacts) > 0) {
      value = this.numRespectsReproduction(artifacts) / this.totalRespectsReproduction(artifacts);
    }
    return value;
  }


  /**
  * Calcular artefactos con pruebas substanciales artefactos replicados
  */
  CalculateSubstantialReplicated(artifacts): number {
    let value = 0;

    if (this.totalSubstantialReplicated(artifacts) > 0) {
      value = this.numSubstantialReplicated(artifacts) / this.totalSubstantialReplicated(artifacts);
    }
    return value;
  }

  /**
   * Calcular la tolerancia de los artefactos replicados
   */

  CalculateToleranceReplicated(artifacts): number {
    let value = 0;
    if (this.totalReplicatedTolerance(artifacts)) {
      value = this.numToleranceReplicated(artifacts) / this.totalReplicatedTolerance(artifacts);
    }
    return value;
  }

  /**
   * Calcular el respeto de los artefactos replicados
   */
  CalculateRespectReplicated(artifacts): number {
    let value = 0;
    if (this.totalRespectsReplication(artifacts) > 0) {
      value = this.numRespectsReplication(artifacts) / this.totalRespectsReplication(artifacts);
    }
    return value;
  }





}
