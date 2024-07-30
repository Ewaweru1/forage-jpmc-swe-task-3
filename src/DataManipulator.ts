import { ServerRespond } from './DataStreamer';

// Define the interface for a row of data
export interface Row {
  price_abc: number;
  price_def: number;
  ratio: number;
  timestamp: Date;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
}

// Define the class that manipulates server responses
export class DataManipulator {
  // Static method to generate a Row from server responses
  static generateRow(serverResponds: ServerRespond[]): Row {
    // Ensure that serverResponds contains at least two elements
    if (serverResponds.length < 2) {
      throw new Error('Insufficient data from server');
    }

    // Calculate the average price for ABC and DEF stocks
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;

    // Calculate the price ratio between ABC and DEF
    const ratio = priceABC / priceDEF;

    // Define upper and lower bounds for the price ratio
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;

    // Determine the latest timestamp from the server responses
    const timestamp = serverResponds[0].timestamp > serverResponds[1].timestamp 
      ? serverResponds[0].timestamp 
      : serverResponds[1].timestamp;

    // Return a Row object with calculated values
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
}
