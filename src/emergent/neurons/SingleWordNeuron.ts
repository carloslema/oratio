import { LevenshteinDistanceMatcher } from "../../language/words/LevenshteinDistanceMatcher";
import { Silence } from "./responses/Silence";
import { INeuronResponse, SimpleResponse } from "./responses/SimpleResponse";
import { IHiveMindNeuron } from "../HiveMindNeurons";
import { NumberOfKnownWordsCertaintyCalculator } from "../../language/sequences/NumberOfKnownWordsCertaintyCalculator";

export class SingleWordNeuron implements IHiveMindNeuron {
  private knownWords: string[];
  private response: string;

  constructor(knownWords: string[], response: string) {
    this.knownWords = knownWords;
    this.response = response;
  }

  public process(
    input: string[],
    locale: string,
    context: any
  ): Promise<INeuronResponse> {
    for (const knownWord of this.knownWords) {
      for (const inputWord of input) {
        if (LevenshteinDistanceMatcher.MATCHER.matches(inputWord, knownWord)) {
          return Promise.resolve(
            new SimpleResponse(
              this.response,
              [],
              NumberOfKnownWordsCertaintyCalculator.calculate(1, input)
            )
          );
        }
      }
    }

    return Promise.resolve(new Silence());
  }
}
