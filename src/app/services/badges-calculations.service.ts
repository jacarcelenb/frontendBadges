import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BadgesCalculationsService {

  constructor() { }

  /**
   * Este metodo devuelve el valor del parametro de la insignia
   * funcional segun los casos PP1,PP2,PP3
   * @param experiment
   * @returns
   */
  getFuncionalParameterValue(experiment: any): number {
    let parameter_value = 0
    //  PP1
    if (experiment[0].has_scripts == true && experiment[0].has_software == true) {
      parameter_value = 6.25;
    }
    // PP2
    if (experiment[0].has_scripts == false && experiment[0].has_software == false) {
      parameter_value = 8.34;
    }
    //  PP3
    if (experiment[0].has_scripts == true && experiment[0].has_software == false) {
      parameter_value = 7.15;
    }
    if (experiment[0].has_scripts == false && experiment[0].has_software == true) {
      parameter_value = 7.15;
    }

    return parameter_value;
  }

  /**
   * Este metodo devuelve el valor del parametro de la insignia
   * reutilizable segun los casos PP1,PP2,PP3,PP4,PP5
   * @param experiment
   * @returns
   */
  getReusableParemeterValue(experiment: any): number {
    let reusable_parameter_value = 0;
    // caso PP1 de la insignia reutilizable
    if (experiment[0].has_scripts == true && experiment[0].has_software == true && experiment[0].has_source_code == true) {
      reusable_parameter_value = 3.6;
    }
    // caso PP2 de la insignia reutlizable
    if (experiment[0].has_scripts == true && experiment[0].has_software == true && experiment[0].has_source_code == false) {
      reusable_parameter_value = 5.6;
    }
    // caso PP3 de la insignia reutlizable se registra o no scripts
    if (experiment[0].has_scripts == true && experiment[0].has_software == false && experiment[0].has_source_code == false) {
      reusable_parameter_value = 3.85;
    }

    // caso PP4 de la insignia reutlizable se registra o no software
    if ( experiment[0].has_software == true && experiment[0].has_scripts == false  && experiment[0].has_source_code == false) {
      reusable_parameter_value = 4.8;
    }

    // caso PP5 de la insignia reutlizable

    if ( experiment[0].has_software == false && experiment[0].has_scripts == false  && experiment[0].has_source_code == true) {
      reusable_parameter_value = 3.71;
    }
    return reusable_parameter_value
  }
  /**
   * El siguiente metodo  devuelve el valor del parametro de la insignia
     * disponible segun los casos PP1,PP2
   * @param numArtifacstWithCredentials
   * @returns
   */
  getAvalaibleParemeterValue(numArtifacstWithCredentials: number) {
    let disponible_parameter_value = 50
    if (numArtifacstWithCredentials > 0) {
      disponible_parameter_value = 33.4
    }
    return disponible_parameter_value;
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
     console.log(numtotalScripts, numExecScripts, value_param)
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
    console.log(numtotalSoftware)
    console.log(numExecSoftware)
    if (numtotalSoftware > 0) {
      value = numExecSoftware / numtotalSoftware
    }
    console.log(value)
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

    console.log(numTasksArtifactOperational)
    console.log(numTasksNeedsArtifactOperational)
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
    console.log(numTasksArtifactDescriptive)
    console.log(numTasksNeedsArtifactDescriptive)
    let value = 0
    let resp = 0
    if (numTasksNeedsArtifactDescriptive > 0) {
      value = numTasksArtifactDescriptive /numTasksNeedsArtifactDescriptive
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
      value =  numtasksWithArtifacts / numtasksNeedsArtifacts;
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

    console.log("Data manipulada", totalDataManipulated)
    console.log("Total data manipulada", totalData)
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
      if (artifacts[index].evaluation.time_complete_execution != null) {
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
      if (artifacts[index].evaluation.time_short_execution != null) {
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
      if (artifacts[index].reproduced.tolerance_framework_reproduced != null) {
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
       if (artifacts[index].reproduced.substantial_evidence_reproduced != null) {
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
           if (artifacts[index].reproduced.respects_reproduction!= null) {
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
       if (artifacts[index].replicated.tolerance_framework_replicated != null) {
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
        if (artifacts[index].replicated.substantial_evidence_replicated != null) {
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
            if (artifacts[index].replicated.respects_replication != null) {
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
      CalculateSubstantialArtifacts(artifacts): number{
        let value = 0;
        if (this.totalSubstantialEvidence(artifacts) > 0) {
          value = this.numSubstantialEvidence(artifacts)/this.totalSubstantialEvidence(artifacts);
       }
       return value;
      }

      /**
       * Calcular la tolerancia de los artefactos reproducidos
       */

      CalculateToleranceArtifacts(artifacts): number{
        let value = 0;
        if(this.totalFrameworkTolerance(artifacts)){
         value = this.numFrameworkTolerance(artifacts)/this.totalFrameworkTolerance(artifacts);
        }
        return value;
      }

      /**
       * Calcular el respeto de los artefactos reproducidos
       */
      CalculateRespectReproducedArtifacts(artifacts): number{
        let value = 0;
        if (this.totalRespectsReproduction(artifacts) > 0) {
          value =this.numRespectsReproduction(artifacts)/this.totalRespectsReproduction(artifacts);
        }
        return value;
      }


       /**
       * Calcular artefactos con pruebas substanciales artefactos replicados
       */
        CalculateSubstantialReplicated(artifacts): number{
          let value = 0;
          if (this.totalSubstantialReplicated(artifacts) > 0) {
            value = this.numSubstantialReplicated(artifacts)/this.totalSubstantialReplicated(artifacts);
         }
         return value;
        }

        /**
         * Calcular la tolerancia de los artefactos replicados
         */

        CalculateToleranceReplicated(artifacts): number{
          let value = 0;
          if(this.totalReplicatedTolerance(artifacts)){
           value = this.numToleranceReplicated(artifacts)/this.totalReplicatedTolerance(artifacts);
          }
          return value;
        }

        /**
         * Calcular el respeto de los artefactos replicados
         */
        CalculateRespectReplicated(artifacts): number{
          let value = 0;
          if (this.totalRespectsReplication(artifacts) > 0) {
            value =this.numRespectsReplication(artifacts)/this.totalRespectsReplication(artifacts);
          }
          return value;
        }





}
