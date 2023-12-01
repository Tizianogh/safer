import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerGraphCamComponent } from './container-graph-cam/container-graph-cam.component';
import { GraphBarchartComponent } from './graph-barchart/graph-barchart.component';
import { GraphCamCatvComponent } from './graph-cam-catv/graph-cam-catv.component';
import { GraphCamDepComponent } from './graph-cam-dep/graph-cam-dep.component';
import { GraphCamGravComponent } from './graph-cam-grav/graph-cam-grav.component';
import { GraphCamLuminositeComponent } from './graph-cam-luminosite/graph-cam-luminosite.component';
import { GraphCamMeteoComponent } from './graph-cam-meteo/graph-cam-meteo.component';
import { GraphCamSexeComponent } from './graph-cam-sexe/graph-cam-sexe.component';
import { GraphCamTrajetComponent } from './graph-cam-trajet/graph-cam-trajet.component';
import { GraphHistoDepComponent } from './graph-histo-dep/graph-histo-dep.component';
import { GraphScatterplotComponent } from './graph-scatterplot/graph-scatterplot.component';
import { GraphComponent } from './graph_line/graph.component';
import { HomeComponent } from './home/home.component';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { MapViewComponent } from './map-view/map-view.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'map', component: MapViewComponent },
  { path: 'graph', component: GraphComponent },
  { path: 'itinerary', component: ItineraryComponent },
  { path: 'graph-scatterplot', component: GraphScatterplotComponent },
  { path: 'graph-bar', component: GraphBarchartComponent },
  { path: 'graph-cam-age', component: ContainerGraphCamComponent },
  { path: 'graph-cam-trajet', component: GraphCamTrajetComponent },
  { path: 'graph-cam-grav', component: GraphCamGravComponent },
  { path: 'graph-cam-catv', component: GraphCamCatvComponent },
  { path: 'graph-cam-sexe', component: GraphCamSexeComponent },
  { path: 'graph-cam-luminosite', component: GraphCamLuminositeComponent },
  { path: 'graph-cam-meteo', component: GraphCamMeteoComponent },
  { path: 'map/graph', component: GraphComponent },
  { path: 'map/graph-bar', component: GraphHistoDepComponent },
  { path: 'map/grap-cam', component: GraphCamDepComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
