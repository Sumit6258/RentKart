import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private loaded = false;
  private apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your API key

  constructor() {}

  loadGoogleMaps(): Promise<any> {
    if (this.loaded) {
      return Promise.resolve(google);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.loaded = true;
        resolve(google);
      };
      
      script.onerror = (error) => {
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  }

  initAutocomplete(inputElement: HTMLInputElement, callback: (place: any) => void) {
    this.loadGoogleMaps().then((google) => {
      const autocomplete = new google.maps.places.Autocomplete(inputElement, {
        types: ['address'],
        componentRestrictions: { country: 'in' }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          callback(place);
        }
      });
    });
  }

  createMap(element: HTMLElement, lat: number, lng: number): Promise<any> {
    return this.loadGoogleMaps().then((google) => {
      const map = new google.maps.Map(element, {
        center: { lat, lng },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false
      });

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        draggable: true
      });

      return { map, marker, google };
    });
  }
}
