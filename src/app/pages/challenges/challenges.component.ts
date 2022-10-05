import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {Challenge} from "../../model/challenges";
import {ChallengeService} from "../../services/challenge.service";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css']
})
export class ChallengesComponent implements OnInit {

  ChallengeForm: FormGroup;
  challengeData: Challenge;
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = ['id', 'title', 'urlToImage', 'challengeType', 'businessId', 'actions'];

  constructor( public service: ChallengeService, private router: Router, private builder: FormBuilder) {
   this.challengeData = {} as Challenge;
    this.dataSource = new MatTableDataSource<any>();
    this.ChallengeForm = this.builder.group({
      title: ['', [Validators.required, Validators.maxLength(60)]],
      urlToImage: [''],
      challengeType: [''],
      businessId: ['']
    })
  }

  get title(){return this.ChallengeForm.controls['title']}
  get urlToImage(){return this.ChallengeForm.controls['urlToImage']}
  get challengeType(){return this.ChallengeForm.controls['challengeType']}
  get businessId(){return this.ChallengeForm.controls['businessId']}

  @ViewChild('ChallengeForm', {static: false})
  form! : NgForm;

  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  isEditChallenge: boolean | undefined;


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    //this.dataSource.paginator = this.paginator;
    this.getAllChallenge();

  }

  getAllChallenge(){
    this.service.getAll().subscribe((response :any) => {
      this.dataSource.data = response;

    });
  }

  addChallenge(){
    if (this.title.hasError('required') || this.challengeType.hasError('required')
      || this.urlToImage.hasError('required') || this.businessId.hasError('required')){
      console.log('there is value required');
      return ;
    }else{
      console.log('data sent');
    }

    this.challengeData.id = 0;
    this.service.create(this.challengeData).subscribe((response: any)=>{
      this.dataSource.data.push({...response});
      this.dataSource.data = this.dataSource.data.map((o: any)=>{return o;})
    })
  }

  deleteChallenge(id: number){
    this.service.delete(id).subscribe(()=>{
      this.dataSource.data = this.dataSource.data.filter((o:any)=>{
        return o.id !== id? o : false;
      })
    })
  }

  updateChallenge(){
    if (this.title.hasError('required') || this.challengeType.hasError('required')
      || this.urlToImage.hasError('required') || this.businessId.hasError('required')){
      console.log('there is value required');
      return ;
    }else{
      console.log('data sent');
    }

    this.service.update(this.challengeData.id, this.challengeData).subscribe((response:any)=>{
      this.dataSource.data = this.dataSource.data.map((o: Challenge) => {
        if (o.id == response.id) {
          o = response;
        }
        return o;
      });
    })
  }

  editChallenge(id: number,item: Challenge){
    this.challengeData = _.cloneDeep(item);
    this.isEditChallenge = true;
}
  cancelChallenge(){
    this.isEditChallenge=false;
    this.ChallengeForm.reset();
  }

  onSubmit() {
    if (this.ChallengeForm.valid) {
      console.log('valid');
      if (this.isEditChallenge) {
        console.log(' about to update');
        this.updateChallenge();
      } else {
        console.log('about to add');
       // this.addChallenge();
      }
      this.cancelChallenge();
    } else {
      console.log('Invalid data');
    }
  }

}
