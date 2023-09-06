import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Location } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { ResourceService } from "app/services/resource.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ResourceRQ } from "app/model/resourceRQ.model";
import { Resource } from "app/model/resource.model";
import { UrlActivity } from "app/model/urlActivity.model";
import { UnirCActivity } from "app/model/unirCActivity.model";
import { UnirCRecord } from "app/model/unirCRecord.model";
import { CategoryRecord } from "app/model/categoryRecord.model";
import { CatActivity } from "app/model/catActivity.model";

@Component({
  selector: "app-resources",
  templateUrl: "./resources.component.html",
  styleUrls: ["./resources.component.css"],
})
export class ResourcesComponent implements OnInit {
  location: Location;

  selectedImage: any = null;
  selectedAudio: any = null;
  tagsR: string[];
  dtSelected: boolean = false;
  dtNameSelected: string = "";
  displayTagsR: string[] = [];
  allTagsRes: any[] = [];

  filesActivity: File[] = [];
  filesFormId: any[] = [];

  newTag: string = "";
  optStepper: boolean = false;

  currentActivitiesSupported = ([] = [
    {
      name: "Une las correspondencias",
      description:
        "Busca parejas o haz conexiones entre elementos que tienen algo en común",
    },
    {
      name: "Categorizar",
      description:
        "Organiza cosas en diferentes grupos o categorías según sus características similares",
    },
  ]);

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  formActivity: FormGroup;

  formUrl: FormGroup;

  formDG: FormGroup;
  fileDG: any = null;
  dataConfigFileDG = [];
  keysDefined = [];
  catsDefined = [];

  publicResources = [];
  pubResourcesType = [];
  structuredPubRes = new Map<string, Array<object>>();

  privateResources = [];
  prResourcesType = [];
  structuredPrRes = new Map<string, Array<object>>();

  constructor(
    location: Location,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private resourceService: ResourceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params.typeResource == "add") {
        this.allTagsRes = [];
        this.firstFormGroup = this.formBuilder.group({
          typeR: ["", Validators.required],
        });
        this.secondFormGroup = this.formBuilder.group({
          instruction: ["", Validators.required],
        });
        this.thirdFormGroup = this.formBuilder.group({
          titleR: ["", Validators.required],
          descriptionR: ["", Validators.required],
          visibilityR: ["", Validators.required],
        });
        this.formDG = this.formBuilder.group({
          activityType: ["", Validators.required],
        });
        this.formUrl = this.formBuilder.group({
          url: ["", Validators.required],
        });
        this.formActivity = this.formBuilder.group({
          unirCActivity: this.formBuilder.array([]),
          catActivity: this.formBuilder.array([]),
        });
        this.displayTagsR = [];
        this.dtSelected = false;
        this.dtNameSelected = "";
        this.fileDG = null;
        this.dataConfigFileDG = [];
        this.keysDefined = [];
        this.catsDefined = [];
        this.resourceService.getAllCategories().subscribe(
          (next) => {
            next.forEach((data) => {
              this.allTagsRes.push({ name: data, completed: false });
            });
          },
          (error) => {
            console.log(error);
          }
        );
      }
      if (
        params.typeResource == "PU" &&
        (!params.catResource || params.catResource == "TODAS") &&
        !params.search
      ) {
        this.publicResources = [];
        this.pubResourcesType = [];
        this.structuredPubRes = new Map<string, Array<any>>();
        this.resourceService.getPublicResources().subscribe(
          (next) => {
            this.publicResources = next;
            //console.log(next)
            this.getAllPubResourcesType();
            this.structurePublicResources();
            sessionStorage.setItem(
              "currentCategories",
              JSON.stringify(this.pubResourcesType)
            );
          },
          (error) => {
            console.log(error);
          }
        );
      }
      if (
        params.typeResource == "PR" &&
        (!params.catResource || params.catResource == "TODAS") &&
        !params.search
      ) {
        this.privateResources = [];
        this.prResourcesType = [];
        this.structuredPrRes = new Map<string, Array<any>>();
        var resourceRq = new ResourceRQ(
          sessionStorage.getItem("email"),
          "PRIVATE",
          "",
          []
        );
        this.resourceService.getResourcesByOwnerAndType(resourceRq).subscribe(
          (next) => {
            this.privateResources = next;
            this.getAllPrResourcesType();
            this.structurePrivateResources();
            sessionStorage.setItem(
              "currentCategories",
              JSON.stringify(this.prResourcesType)
            );
          },
          (error) => {
            console.log(error);
          }
        );
      }

      if (
        params.catResource &&
        params.catResource != "TODAS" &&
        params.typeResource == "PU"
      ) {
        this.resourceService.getPublicResources().subscribe(
          (next) => {
            this.publicResources = next;
            this.categorySelected(params.typeResource, params.catResource);
          },
          (error) => {
            console.log(error);
          }
        );
      }

      if (
        params.catResource &&
        params.catResource != "TODAS" &&
        params.typeResource == "PR"
      ) {
        var resourceRq = new ResourceRQ(
          sessionStorage.getItem("email"),
          "PRIVATE",
          "",
          []
        );
        this.resourceService.getResourcesByOwnerAndType(resourceRq).subscribe(
          (next) => {
            this.privateResources = next;
            this.categorySelected(params.typeResource, params.catResource);
          },
          (error) => {
            console.log(error);
          }
        );
      }

      if (params.search) {
        if (params.typeResource == "PU") {
          this.publicResources = [];
          this.pubResourcesType = [];
          this.structuredPubRes = new Map<string, Array<any>>();
          this.resourceService
            .getPublicResourcesByNameLike(params.search)
            .subscribe(
              (next) => {
                this.publicResources = next;
                this.getAllPubResourcesType();
                this.structurePublicResources();
                sessionStorage.setItem(
                  "currentCategories",
                  JSON.stringify(this.pubResourcesType)
                );
              },
              (error) => {
                console.log(error);
              }
            );
        }
        if (params.typeResource == "PR") {
          this.privateResources = [];
          this.prResourcesType = [];
          this.structuredPrRes = new Map<string, Array<any>>();
          this.resourceService
            .getPrivateResourcesByNameLike(
              params.search,
              sessionStorage.getItem("email")
            )
            .subscribe(
              (next) => {
                this.privateResources = next;
                this.getAllPrResourcesType();
                this.structurePrivateResources();
                sessionStorage.setItem(
                  "currentCategories",
                  JSON.stringify(this.prResourcesType)
                );
              },
              (error) => {
                console.log(error);
              }
            );
        }
      }
    });
  }

  categorySelected(type, category): void {
    if (type == "PU") {
      this.structuredPubRes = new Map<string, Array<any>>();
      this.pubResourcesType = [];
      this.pubResourcesType.push(category);
      this.pubResourcesType.forEach((cat) => {
        this.publicResources.forEach((data) => {
          if (cat == category) {
            if (data.category.includes(cat)) {
              const arrayObjects = [];
              if (this.structuredPubRes.has(cat)) {
                const objects = arrayObjects.concat(
                  arrayObjects,
                  this.structuredPubRes.get(cat)
                );
                objects.push(data);
                this.structuredPubRes.set(cat, objects);
              } else {
                arrayObjects.push(data);
                this.structuredPubRes.set(cat, arrayObjects);
              }
            }
          }
        });
      });
    }
    if (type == "PR") {
      this.structuredPrRes = new Map<string, Array<any>>();
      this.prResourcesType = [];
      this.prResourcesType.push(category);
      this.prResourcesType.forEach((cat) => {
        this.privateResources.forEach((data) => {
          if (cat == category) {
            if (data.category.includes(cat)) {
              const arrayObjects = [];
              if (this.structuredPrRes.has(cat)) {
                const objects = arrayObjects.concat(
                  arrayObjects,
                  this.structuredPrRes.get(cat)
                );
                objects.push(data);
                this.structuredPrRes.set(cat, objects);
              } else {
                arrayObjects.push(data);
                this.structuredPrRes.set(cat, arrayObjects);
              }
            }
          }
        });
      });
    }
  }

  playResourceTitle(path: string): void {
    const title = new Audio("http://localhost/" + path);
    title.play();
  }

  getAllPubResourcesType(): void {
    this.publicResources.forEach((data) => {
      data.category.forEach((cat) => {
        if (!this.pubResourcesType.includes(cat)) {
          this.pubResourcesType.push(cat);
        }
      });
    });
  }

  getAllPrResourcesType(): void {
    this.privateResources.forEach((data) => {
      data.category.forEach((cat) => {
        if (!this.prResourcesType.includes(cat)) {
          this.prResourcesType.push(cat);
        }
      });
    });
  }

  structurePublicResources(): void {
    this.pubResourcesType.forEach((cat) => {
      this.publicResources.forEach((data) => {
        if (data.category.includes(cat)) {
          const arrayObjects = [];
          if (this.structuredPubRes.has(cat)) {
            const objects = arrayObjects.concat(
              arrayObjects,
              this.structuredPubRes.get(cat)
            );
            objects.push(data);
            this.structuredPubRes.set(cat, objects);
          } else {
            arrayObjects.push(data);
            this.structuredPubRes.set(cat, arrayObjects);
          }
        }
      });
    });
  }

  structurePrivateResources(): void {
    this.prResourcesType.forEach((cat) => {
      this.privateResources.forEach((data) => {
        if (data.category.includes(cat)) {
          const arrayObjects = [];
          if (this.structuredPrRes.has(cat)) {
            const objects = arrayObjects.concat(
              arrayObjects,
              this.structuredPrRes.get(cat)
            );
            objects.push(data);
            this.structuredPrRes.set(cat, objects);
          } else {
            arrayObjects.push(data);
            this.structuredPrRes.set(cat, arrayObjects);
          }
        }
      });
    });
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }
    var typeResource = titlee.split("/");
    if (typeResource[2] == "PU") {
      return "PU";
    }
    if (typeResource[2] == "PR") {
      return "PR";
    }
    if (typeResource[2] == "add") {
      return "AD";
    }
  }

  createResource(): void {
    const resource = new Resource(
      sessionStorage.getItem("email"),
      this.thirdFormGroup.get("visibilityR")?.value,
      this.thirdFormGroup.get("titleR")?.value,
      this.thirdFormGroup.get("descriptionR")?.value,
      this.displayTagsR
    );
    let activity: any;
    let activityType: string;
    let data: any;
    switch (this.firstFormGroup.get("typeR")?.value) {
      case "dg":
        switch (this.formDG.get("activityType")?.value) {
          case "Une las correspondencias":
            data = { ...this.formActivity.get("unirCActivity")?.value };
            activityType = "unirC";
            var valuesUnirC = Object.values(data) as UnirCRecord[];
            activity = new UnirCActivity(
              this.secondFormGroup.get("instruction")?.value,
              valuesUnirC
            );
            break;
          case "Categorizar":
            data = { ...this.formActivity.get("catActivity")?.value };
            activityType = "cat";
            var valuesCat = Object.values(data) as CategoryRecord[];
            activity = new CatActivity(
              this.secondFormGroup.get("instruction")?.value,
              valuesCat
            );
            break;
        }
        break;
      case "url":
        activity = new UrlActivity(
          this.secondFormGroup.get("instruction")?.value,
          this.formUrl.get("url")?.value
        );
        activityType = "url";
        break;
      case "dt":
        switch (this.dtNameSelected) {
          case "Une las correspondencias":
            data = { ...this.formActivity.get("unirCActivity")?.value };
            activityType = "unirC";
            var valuesUnirC = Object.values(data) as UnirCRecord[];
            activity = new UnirCActivity(
              this.secondFormGroup.get("instruction")?.value,
              valuesUnirC
            );
            break;
          case "Categorizar":
            data = { ...this.formActivity.get("catActivity")?.value };
            activityType = "cat";
            var valuesCat = Object.values(data) as CategoryRecord[];
            activity = new CatActivity(
              this.secondFormGroup.get("instruction")?.value,
              valuesCat
            );
            break;
        }
        break;
    }
    console.log(this.filesActivity);
    this.resourceService
      .createResource(
        resource,
        this.selectedImage,
        this.selectedAudio,
        activityType,
        activity,
        this.filesActivity ? this.filesActivity : null
      )
      .subscribe(
        (next) => {
          let resVis = resource.type == "PUBLIC" ? "PU" : "PR";
          this.router.navigate([
            "/resources/" + resVis + "/search/" + resource.name,
          ]);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  reloadPage(): void {
    window.location.reload();
  }

  verifyDesignActivity(): boolean {
    switch (this.firstFormGroup.get("typeR")?.value) {
      case "dg":
        if (this.secondFormGroup.valid && this.fileDG && this.formDG.valid) {
          if (this.formActivity.get("unirCActivity")?.value.length > 0) {
            const unirCActivityArray = this.formActivity.get(
              "unirCActivity"
            ) as FormArray;
            const allDataHaveValues = unirCActivityArray.controls.every(
              (dataFormGroup: FormGroup) => {
                const keyFields = ["key", "keyImg", "keyAudio"];
                const definitionFields = [
                  "definition",
                  "definitionImg",
                  "definitionAudio",
                ];

                const hasKeyValues = keyFields.some(
                  (key) =>
                    dataFormGroup.get(key)?.value !== null &&
                    dataFormGroup.get(key)?.value !== ""
                );
                const hasDefinitionValues = definitionFields.some(
                  (def) =>
                    dataFormGroup.get(def)?.value !== null &&
                    dataFormGroup.get(def)?.value !== ""
                );
                return hasKeyValues && hasDefinitionValues;
              }
            );
            if (allDataHaveValues) {
              return false;
            }
          }

          if (
            this.formActivity.get("catActivity")?.value.length > 0 &&
            this.formActivity
              .get("catActivity")
              ?.value.map((dataFormGroup: any) => dataFormGroup.elements)[0]
              ?.length > 0
          ) {
            const catActivityArray = this.formActivity.get(
              "catActivity"
            ) as FormArray;

            const allDataHaveValues = catActivityArray.controls.every(
              (dataFormGroup: FormGroup) => {
                const categoryFields = [
                  "category",
                  "categoryImg",
                  "categoryAudio",
                ];
                const elements = dataFormGroup.get("elements") as FormArray;
                const hasCategoryValues = categoryFields.some(
                  (field) =>
                    dataFormGroup.get(field)?.value !== null &&
                    dataFormGroup.get(field)?.value !== ""
                );
                const allElementsHaveValues = elements.controls.every(
                  (element: FormGroup) => {
                    const elementFields = [
                      "element",
                      "elementImg",
                      "elementAudio",
                    ];
                    return elementFields.some(
                      (field) =>
                        element.get(field)?.value !== null &&
                        element.get(field)?.value !== ""
                    );
                  }
                );
                return hasCategoryValues && allElementsHaveValues;
              }
            );
            if (allDataHaveValues) {
              return false;
            }
          }
        }
        break;
      case "url":
        if (this.secondFormGroup.valid && this.formUrl.valid) {
          return false;
        }
        break;
      case "dt":
        if (
          this.dtSelected &&
          this.dtNameSelected &&
          this.secondFormGroup.valid
        ) {
          if (this.formActivity.get("unirCActivity")?.value.length > 0) {
            const unirCActivityArray = this.formActivity.get(
              "unirCActivity"
            ) as FormArray;
            const allDataHaveValues = unirCActivityArray.controls.every(
              (dataFormGroup: FormGroup) => {
                const keyFields = ["key", "keyImg", "keyAudio"];
                const definitionFields = [
                  "definition",
                  "definitionImg",
                  "definitionAudio",
                ];

                const hasKeyValues = keyFields.some(
                  (key) =>
                    dataFormGroup.get(key)?.value !== null &&
                    dataFormGroup.get(key)?.value !== ""
                );
                const hasDefinitionValues = definitionFields.some(
                  (def) =>
                    dataFormGroup.get(def)?.value !== null &&
                    dataFormGroup.get(def)?.value !== ""
                );
                return hasKeyValues && hasDefinitionValues;
              }
            );
            if (allDataHaveValues) {
              return false;
            }
          }

          if (
            this.formActivity.get("catActivity")?.value.length > 0 &&
            this.formActivity
              .get("catActivity")
              ?.value.map((dataFormGroup: any) => dataFormGroup.elements)[0]
              ?.length > 0
          ) {
            const catActivityArray = this.formActivity.get(
              "catActivity"
            ) as FormArray;

            const allDataHaveValues = catActivityArray.controls.every(
              (dataFormGroup: FormGroup) => {
                const categoryFields = [
                  "category",
                  "categoryImg",
                  "categoryAudio",
                ];
                const elements = dataFormGroup.get("elements") as FormArray;
                const hasCategoryValues = categoryFields.some(
                  (field) =>
                    dataFormGroup.get(field)?.value !== null &&
                    dataFormGroup.get(field)?.value !== ""
                );
                const allElementsHaveValues = elements.controls.every(
                  (element: FormGroup) => {
                    const elementFields = [
                      "element",
                      "elementImg",
                      "elementAudio",
                    ];
                    return elementFields.some(
                      (field) =>
                        element.get(field)?.value !== null &&
                        element.get(field)?.value !== ""
                    );
                  }
                );
                return hasCategoryValues && allElementsHaveValues;
              }
            );
            if (allDataHaveValues) {
              return false;
            }
          }
        }
        break;
    }
    return true;
  }

  processFile(): void {
    this.dataConfigFileDG = [];
    this.keysDefined = [];
    this.catsDefined = [];
    this.formActivity = this.formBuilder.group({
      unirCActivity: this.formBuilder.array([]),
      catActivity: this.formBuilder.array([]),
    });
    this.resourceService.processFile(this.fileDG).subscribe(
      (next) => {
        next.forEach((data) => {
          this.dataConfigFileDG.push({ data: data, type: "", used: false });
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  removeItem(item: string): void {
    const index = this.dataConfigFileDG.findIndex(function (obj) {
      return obj.data === item;
    });
    if (index !== -1) {
      this.dataConfigFileDG.splice(index, 1);
    }
  }

  buildActivity(data: string, type: string) {
    var defType: any = [];
    switch (this.formDG.get("activityType")?.value) {
      case "Une las correspondencias":
        if (type == "key") {
          this.addDataUnirCActivityKeyDG(data);
        }
        defType = type.split("/");
        if (defType[0] == "definition") {
          this.addDataUnirCActivityDefinitionDG(defType[1], data);
        }
        break;
      case "Categorizar":
        if (type == "cat") {
          this.addDataCatActivityCatDG(data);
        }
        defType = type.split("/");
        if (defType[0] == "element") {
          this.addDataCatActivityEleDG(defType[1], data);
        }
        break;
    }
  }

  ver() {
    console.log(this.dataConfigFileDG);
  }

  get unirCActivity() {
    return this.formActivity.get("unirCActivity") as FormArray;
  }

  addDataUnirCActivity() {
    const dataFormGroup = this.formBuilder.group({
      key: [null],
      keyImg: [null],
      keyAudio: [null],
      definition: [null],
      definitionImg: [null],
      definitionAudio: [null],
    });
    this.unirCActivity.push(dataFormGroup);
  }

  addDataUnirCActivityKeyDG(key: string) {
    const recordFound = this.unirCActivity.controls.find(
      (control: FormGroup) => control.get("key").value === key
    );
    if (!recordFound) {
      if (this.unirCActivity.length > 0) {
        let recordF = this.unirCActivity.controls.find(
          (control: FormGroup) => control.get("definition").value === key
        );
        if (recordF) {
          recordF.get("definition").setValue("");
        }
      }
      const dataFormGroup = this.formBuilder.group({
        key: [key],
        keyImg: [null],
        keyAudio: [null],
        definition: [null],
        definitionImg: [null],
        definitionAudio: [null],
      });
      this.keysDefined.push(key);
      const foundData = this.dataConfigFileDG.find((item) => item.data === key);
      foundData.used = true;
      this.unirCActivity.push(dataFormGroup);
    }
  }

  addDataUnirCActivityDefinitionDG(key: string, definition: string) {
    const recordF = this.unirCActivity.controls.find(
      (control: FormGroup) => control.get("key").value === definition
    );
    if (recordF) {
      let index = this.keysDefined.findIndex((key) => key == definition);
      const foundData = this.dataConfigFileDG.find(
        (item) => item.data === definition
      );
      foundData.used = false;
      recordF.get("key").setValue("");
      this.keysDefined.splice(index, 1);
    }
    const recordFound = this.unirCActivity.controls.find(
      (control: FormGroup) => control.get("key").value === key
    );
    if (recordFound) {
      const foundData = this.dataConfigFileDG.find(
        (item) => item.data === definition
      );
      foundData.used = true;
      if (
        recordFound.get("definition").value != null &&
        recordFound.get("definition").value != ""
      ) {
        const found = this.dataConfigFileDG.find(
          (item) => item.data === recordFound.get("definition").value
        );
        found.used = false;
        found.type = "";
      }
      recordFound.get("definition").setValue(definition);
    }
  }

  addDataCatActivityCatDG(cat: string) {
    const recordFound = this.catActivity.controls.find(
      (control: FormGroup) => control.get("category").value === cat
    );
    if (!recordFound) {
      if (this.catActivity && this.catActivity.length > 0) {
        for (const catCGroup of this.catActivity.controls) {
          const elementsControl = catCGroup.get("elements") as FormArray;
          if (elementsControl && elementsControl.value.length > 0) {
            for (const elementGroup of elementsControl.controls) {
              const elementControl = elementGroup.get("element");
              console.log(elementGroup.get("element")?.value);
              if (elementControl && elementControl.value === cat) {
                elementGroup.get("element").setValue("");
                break;
              }
            }
          }
        }
      }
      const dataFormGroup = this.formBuilder.group({
        category: [cat],
        categoryImg: [null],
        categoryAudio: [null],
        elements: this.formBuilder.array([], Validators.required),
      });
      this.catsDefined.push(cat);
      const foundData = this.dataConfigFileDG.find((item) => item.data === cat);
      foundData.used = true;
      this.catActivity.push(dataFormGroup);
    }
  }

  addDataCatActivityEleDG(cat: string, element: string) {
    const recordFound = this.catActivity.controls.find(
      (control: FormGroup) => control.get("category").value === cat
    );
    const recordF = this.catActivity.controls.find(
      (control: FormGroup) => control.get("category").value === element
    );
    if (recordF) {
      recordF.get("category").setValue("");
    }
    const elements = recordFound.get("elements") as FormArray;
    const dataFormGroup = this.formBuilder.group({
      element: [element],
      elementImg: [null],
      elementAudio: [null],
    });
    const foundData = this.dataConfigFileDG.find(
      (item) => item.data === element
    );
    foundData.used = true;
    elements.push(dataFormGroup);
  }

  deleteDataUnirCActivityDG(id: number) {
    const key = this.unirCActivity.at(id).get("key")?.value;
    if (key) {
      const foundData = this.dataConfigFileDG.find((item) => item.data === key);
      foundData.used = false;
      foundData.type = "";
      let index = this.keysDefined.findIndex((keyV) => keyV == key);
      this.keysDefined.splice(index, 1);
    }
    const definition = this.unirCActivity.at(id).get("definition")?.value;
    if (definition) {
      const foundData = this.dataConfigFileDG.find(
        (item) => item.data === definition
      );
      foundData.used = false;
      foundData.type = "";
    }
    this.unirCActivity.removeAt(id);
  }

  deleteDataUnirCActivity(id: number) {
    this.unirCActivity.removeAt(id);
  }

  get catActivity() {
    return this.formActivity.get("catActivity") as FormArray;
  }

  addDataCatActivity() {
    const dataFormGroup = this.formBuilder.group({
      category: [null],
      categoryImg: [null],
      categoryAudio: [null],
      elements: this.formBuilder.array([], Validators.required),
    });
    this.catActivity.push(dataFormGroup);
  }

  deleteDataCatActivity(id: number) {
    this.catActivity.removeAt(id);
  }

  getCategoryElements(category: AbstractControl): AbstractControl[] {
    if (category instanceof FormGroup) {
      const elements = category.get("elements");
      if (elements instanceof FormArray) {
        return elements.controls;
      }
    }
    return [];
  }

  addDataCategoryElement(category: AbstractControl) {
    const elements = category.get("elements") as FormArray;
    const dataFormGroup = this.formBuilder.group({
      element: [null],
      elementImg: [null],
      elementAudio: [null],
    });
    elements.push(dataFormGroup);
  }

  deleteDataCategoryElemeny(category: AbstractControl, id: number) {
    const elements = category.get("elements") as FormArray;
    elements.removeAt(id);
  }

  onFilesActivity(event: any, id: string): void {
    if (event.target.files[0] !== null && event.target.files[0] !== undefined) {
      const index = this.filesFormId.findIndex((item) => item[0] === id);
      if (index !== -1) {
        const fileIndex = this.filesActivity.findIndex(
          (file) => file.name === this.filesFormId[index][1]
        );
        this.filesActivity.splice(fileIndex, 1);
        this.filesFormId.splice(index, 1);
      }
      this.filesActivity.push(event.target.files[0]);
      this.filesFormId.push([id, event.target.files[0].name]);
    }
  }

  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0] ?? null;
  }

  onAudioSelected(event: any): void {
    this.selectedAudio = event.target.files[0] ?? null;
  }

  onFileDGSelected(event: any): void {
    this.fileDG = event.target.files[0] ?? null;
  }

  defineTagsR(dialog: any): void {
    this.dialog.open(dialog);
  }

  addTagsR(opt: number): void {
    switch (opt) {
      case 0:
        this.tagsR = [];
        this.allTagsRes.forEach((data) => {
          if (data.completed) {
            this.tagsR.push(data.name);
          }
        });
        break;
      case 1:
        this.displayTagsR = this.tagsR;
        break;
      case 2:
        this.tagsR = this.displayTagsR;
        this.allTagsRes.forEach((data) => (data.completed = false));
        this.tagsR.forEach(
          (data) =>
            (this.allTagsRes.find((tag) => tag.name == data).completed = true)
        );
        break;
      case 3:
        let isTag = this.allTagsRes.some((data) => data.name == this.newTag);
        if (!isTag) {
          this.allTagsRes.push({ name: this.newTag, completed: false });
        }
        break;
    }
  }

  changeTemplate(): void {
    this.dtSelected = false;
    this.dtNameSelected = "";
    this.filesActivity = [];
    this.filesFormId = [];
  }

  dtSelectedTemplate(name: string): void {
    this.dtNameSelected = name;
    this.formActivity = this.formBuilder.group({
      unirCActivity: this.formBuilder.array([]),
      catActivity: this.formBuilder.array([]),
    });
    switch (name) {
      case "Une las correspondencias":
        this.addDataUnirCActivity();
        break;
      case "Categorizar":
        this.addDataCatActivity();
        this.addDataCategoryElement(this.catActivity.controls[0]);
        break;
    }
    this.dtSelected = true;
  }
}
