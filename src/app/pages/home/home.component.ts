import { Component, OnInit } from '@angular/core';
import {ChallengeService} from "../../services/challenge.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  count_Challenges: number = 0;
  constructor(public service: ChallengeService) { }


  ngOnInit(): void {
    this.getChallenges();
  }
  getChallenges(){
    this.service.getAll().subscribe((response: any)=>{
      this.count_Challenges = response.length;
    })
  }
}
