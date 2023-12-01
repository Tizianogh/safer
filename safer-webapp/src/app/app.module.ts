import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphCamComponent } from './graph-cam/graph-cam.component';
import { GraphComponent } from './graph_line/graph.component';
import { HomeComponent } from './home/home.component';
import { MapViewComponent } from './map-view/map-view.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

import { FormsModule } from '@angular/forms';
import { ContainerGraphCamComponent } from './container-graph-cam/container-graph-cam.component';
import { GraphBarchartDepComponent } from './graph-barchart-dep/graph-barchart-dep.component';
import { GraphBarchartComponent } from './graph-barchart/graph-barchart.component';
import { GraphCamCatvComponent } from './graph-cam-catv/graph-cam-catv.component';
import { GraphCamDepComponent } from './graph-cam-dep/graph-cam-dep.component';
import { GraphCamGravComponent } from './graph-cam-grav/graph-cam-grav.component';
import { GraphCamInseeComponent } from './graph-cam-insee/graph-cam-insee.component';
import { GraphCamLuminositeComponent } from './graph-cam-luminosite/graph-cam-luminosite.component';
import { GraphCamMeteoComponent } from './graph-cam-meteo/graph-cam-meteo.component';
import { GraphCamSexeComponent } from './graph-cam-sexe/graph-cam-sexe.component';
import { GraphCamTrajetComponent } from './graph-cam-trajet/graph-cam-trajet.component';
import { GraphHistoDepComponent } from './graph-histo-dep/graph-histo-dep.component';
import { GraphScatterplotComponent } from './graph-scatterplot/graph-scatterplot.component';
import { ItineraryComponent } from './itinerary/itinerary.component';

@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    NavBarComponent,
    HomeComponent,
    GraphComponent,
    GraphCamComponent,
    GraphCamDepComponent,
    GraphHistoDepComponent,
    GraphCamInseeComponent,
    ContainerGraphCamComponent,
    GraphScatterplotComponent,
    GraphBarchartDepComponent,
    GraphBarchartComponent,
    ItineraryComponent,
    GraphCamSexeComponent,
    GraphCamMeteoComponent,
    GraphCamLuminositeComponent,
    GraphCamCatvComponent,
    GraphCamTrajetComponent,
    GraphCamGravComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
