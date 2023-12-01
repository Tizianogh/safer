import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public ageGroupOrder = [
    '<15',
    '15-19',
    '20-24',
    '25-29',
    '30-34',
    '35-39',
    '40-44',
    '45-49',
    '50-54',
    '55-59',
    '60-64',
    '65-69',
    '70-74',
    '>75',
  ];

  public ageGroupColors = [
    '#F88379',
    '#72B2B9',
    '#FCD3A4',
    '#74A475',
    '#F78089',
    '#8FD1D1',
    '#9B4F96',
    '#FF8C00',
    '#7CFC00',
    '#FF69B4',
    '#87CEEB',
    '#FFDAB9',
    '#663399',
    '#F4A460',
  ];

  constructor() {}

  yearOfBirthToAgeGroup(yearOfBirth: number): string {
    const currentYear = new Date().getFullYear();
    const age = currentYear - yearOfBirth;

    if (age < 15) {
      return '<15';
    } else if (age >= 15 && age <= 19) {
      return '15-19';
    } else if (age >= 20 && age <= 24) {
      return '20-24';
    } else if (age >= 25 && age <= 29) {
      return '25-29';
    } else if (age >= 30 && age <= 34) {
      return '30-34';
    } else if (age >= 35 && age <= 39) {
      return '35-39';
    } else if (age >= 40 && age <= 44) {
      return '40-44';
    } else if (age >= 45 && age <= 49) {
      return '45-49';
    } else if (age >= 50 && age <= 54) {
      return '50-54';
    } else if (age >= 55 && age <= 59) {
      return '55-59';
    } else if (age >= 60 && age <= 64) {
      return '60-64';
    } else if (age >= 65 && age <= 69) {
      return '65-69';
    } else if (age >= 70 && age <= 74) {
      return '70-74';
    } else {
      return '>75';
    }
  }
}
