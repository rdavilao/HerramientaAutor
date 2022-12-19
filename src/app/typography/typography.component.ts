import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder,Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {

  typeR: string;
  visibilityR: string;
  selectedImage: any = null;
  selectedAudio: any = null;
  tagsR: string[];
  dtSelected: boolean = false;
  dtNameSelected: string = "";
  displayTagsR: string[] = [];
  tagsExample: any[] = [
    {name:'Tag1', completed:false},
    {name:'Tag2', completed:false},
    {name:'Tag3', completed:false},
    {name:'Tag4', completed:false},
    {name:'Tag5', completed:false},];

  firstFormGroup = this.formBuilder.group({
    typeR: ['', Validators.required],
  });
  secondFormGroup = this.formBuilder.group({
    instruction: ['', Validators.required],
  });
  thirdFormGroup = this.formBuilder.group({
    titleR: ['', Validators.required],
    descriptionR: ['', Validators.required],
    visibilityR: ['', Validators.required]
  });  

  sopaLetras = this.formBuilder.array([]);
  pistasSL:boolean = false;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) { }

  ngOnInit() {
  }

  addDataSopaLetras() {
    console.log(this.pistasSL);
    const dataFormGroup = this.formBuilder.group({
      palabra: '',
      pista: ''
    });
    this.sopaLetras.push(dataFormGroup);
  }

  deleteDataSopaLetras(id: number) {
    this.sopaLetras.removeAt(id);
  }

  changePista(): void {
    this.pistasSL = !this.pistasSL;
  }
  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0] ?? null;
  }

  onAudioSelected(event: any): void {
    this.selectedAudio = event.target.files[0] ?? null;
  }

  defineTagsR(dialog: any): void {
    this.dialog.open(dialog);
  }
  
  getDataSopaLetras() {
    return this.sopaLetras as FormArray;
  }

  addTagsR(opt: number): void {
    switch(opt){
      case 0:
      this.tagsR = [];
      this.tagsExample.forEach(data => {
      if(data.completed){
        this.tagsR.push(data.name)
      }})
      break;
      case 1:
      this.displayTagsR = this.tagsR;
      break;
      case 2:
      this.tagsR = this.displayTagsR;
      this.tagsExample.forEach(data => data.completed = false);
      this.tagsR.forEach(data => this.tagsExample.find(tag => tag.name == data).completed = true);
      break;
    }   
  }

  dtSelectedTemplate(name: string): void {
    this.dtNameSelected = name;
    this.dtSelected = true;
    console.log(this.dtNameSelected)
  }
}
