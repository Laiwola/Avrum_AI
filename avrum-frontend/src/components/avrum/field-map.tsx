import { useEffect } from "react";
import { ImageOverlay, MapContainer, TileLayer, useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet-draw";

import { cn } from "@/lib/utils";

export interface FieldMapProps {
  onPolygonChange: (coordinates: number[][][] | null) => void;
  resetKey?: number;
}

export type VegetationBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export interface VegetationMapResponse {
  message: string;
  data: {
    field: {
      id: string;
      name: string;
      areaHectares: number;
    };
    vegetation: {
      ndvi: number | null;
      date: string | null;
    };
    map: {
      image: string;
      bounds: VegetationBounds;
    };
  };
}

export interface VegetationMapProps {
  imageUrl?: string | null;
  bounds?: VegetationBounds | null;
  className?: string;
  heightClassName?: string;
}

const DEFAULT_CENTER: [number, number] = [9.082, 8.6753];

type GeoSearchControlConstructor = new (options: {
  provider: OpenStreetMapProvider;
  style: string;
  showMarker: boolean;
  showPopup: boolean;
  autoClose: boolean;
  retainZoomLevel: boolean;
  animateZoom: boolean;
  searchLabel: string;
}) => L.Control;

type OpenStreetMapProviderConstructor = new () => OpenStreetMapProvider;

function LocationSearch() {
  const map = useMap();

  useEffect(() => {
    const Provider = OpenStreetMapProvider as unknown as OpenStreetMapProviderConstructor;
    const provider = new Provider();

    const SearchControl = GeoSearchControl as unknown as GeoSearchControlConstructor;
    const searchControl = new SearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      searchLabel: "Search farm location...",
    });

    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
}

function FieldDrawing({ onPolygonChange, resetKey }: FieldMapProps) {
  const map = useMap();

  useEffect(() => {
    const featureGroup = new L.FeatureGroup();
    map.addLayer(featureGroup);

    const drawControl = new L.Control.Draw({
      position: "topright",
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
        },
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false,
      },
      edit: {
        featureGroup,
        edit: {},
        remove: true,
      },
    });

    const getCoordinates = (layer: L.Layer): number[][][] | null => {
      if (!(layer instanceof L.Polygon)) return null;

      const latLngs = layer.getLatLngs();
      const firstRing = latLngs[0];
      if (!Array.isArray(firstRing)) return null;

      const coordinates = (firstRing as L.LatLng[]).map((point) => [point.lng, point.lat]);

      if (coordinates.length > 0) {
        const firstCoordinate = coordinates[0]!;
        const lastCoordinate = coordinates[coordinates.length - 1];
        if (
          firstCoordinate[0] !== lastCoordinate?.[0] ||
          firstCoordinate[1] !== lastCoordinate?.[1]
        ) {
          coordinates.push(firstCoordinate);
        }
      }

      return coordinates.length >= 4 ? [coordinates] : null;
    };

    const handleCreated = (event: L.LeafletEvent) => {
      const createdEvent = event as L.DrawEvents.Created;
      featureGroup.clearLayers();
      featureGroup.addLayer(createdEvent.layer);
      onPolygonChange(getCoordinates(createdEvent.layer));
    };

    const handleEdited = (event: L.LeafletEvent) => {
      const editedEvent = event as L.DrawEvents.Edited;
      let coordinates: number[][][] | null = null;
      editedEvent.layers.eachLayer((layer) => {
        coordinates = getCoordinates(layer);
      });
      onPolygonChange(coordinates);
    };

    const handleDeleted = () => {
      onPolygonChange(null);
    };

    map.addControl(drawControl);
    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.EDITED, handleEdited);
    map.on(L.Draw.Event.DELETED, handleDeleted);

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.EDITED, handleEdited);
      map.off(L.Draw.Event.DELETED, handleDeleted);
      map.removeControl(drawControl);
      map.removeLayer(featureGroup);
    };
  }, [map, onPolygonChange, resetKey]);

  return null;
}

export function FieldMap({ onPolygonChange, resetKey = 0 }: FieldMapProps) {
  return (
    <div className="h-[500px] w-full overflow-hidden rounded-xl border">
      <MapContainer center={DEFAULT_CENTER} zoom={6} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationSearch />

        <FieldDrawing onPolygonChange={onPolygonChange} resetKey={resetKey} />
      </MapContainer>
    </div>
  );
}

function FitVegetationBounds({ bounds }: { bounds: VegetationBounds }) {
  const map = useMap();

  useEffect(() => {
    const leafletBounds = L.latLngBounds([
      [bounds.south, bounds.west],
      [bounds.north, bounds.east],
    ]);

    map.fitBounds(leafletBounds, {
      padding: [24, 24],
      maxZoom: 18,
    });
  }, [bounds, map]);

  return null;
}

export function VegetationMap({
  imageUrl,
  bounds,
  className,
  heightClassName = "h-[450px] sm:h-[500px]",
}: VegetationMapProps) {
  const isReady = Boolean(imageUrl && bounds);

  const mapBounds = bounds
    ? ([
        [bounds.south, bounds.west],
        [bounds.north, bounds.east],
      ] as L.LatLngBoundsExpression)
    : null;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border bg-muted",
        heightClassName,
        className,
      )}
    >
      {isReady && mapBounds ? (
        <MapContainer bounds={mapBounds} scrollWheelZoom className="h-full w-full" worldCopyJump>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitVegetationBounds bounds={bounds!} />

          <ImageOverlay url={imageUrl!} bounds={mapBounds} opacity={0.92} />
        </MapContainer>
      ) : (
        <div className="flex h-full items-center justify-center px-6 text-center">
          <div>
            <p className="text-sm font-semibold text-foreground">Map data unavailable</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The vegetation layer for this field is not available right now.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
