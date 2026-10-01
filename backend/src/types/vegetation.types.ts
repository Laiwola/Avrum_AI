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

      bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
      };
    };
  };
}