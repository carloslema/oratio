import { MultipleSequenceNeuron } from "../../emergent/neurons/MultipleSequenceNeuron"
import {
  INeuronResponse,
  SimpleResponse
} from "../../emergent/neurons/responses/SimpleResponse"
import { SequenceParser } from "../../language/sequences/SequenceParser"
import { Sequence } from "../../language/sequences/Sequence"
import { IHiveMindNeuron } from "../../emergent/HiveMindNeurons"
import { RequestContext } from "../../emergent/RequestContext"
import { knownWords } from "./TimeNeuron.words"

export class TimeNeuron implements IHiveMindNeuron {
  public process(
    input: string[],
    locale: string,
    context: RequestContext
  ): Promise<INeuronResponse> {
    let localizedKnownWords: string[] = knownWords.main[locale].words
    if (
      context.hasPreviousInput() &&
      context.previousNeuronHandled instanceof TimeNeuron
    ) {
      const continuations: string[] = knownWords.continuation[locale].words
      localizedKnownWords = localizedKnownWords.concat(continuations)
    }

    const sequences = SequenceParser.parse(localizedKnownWords)
    const initialResponse: Promise<
      INeuronResponse
    > = new MultipleSequenceNeuron(
      sequences.singleWord.map((sequence: Sequence) => sequence.withoutSpaces),
      sequences.twoWords.map((sequence: Sequence) => sequence.withoutSpaces),
      sequences.threeWords.map((sequence: Sequence) => sequence.withoutSpaces),
      sequences.fourWords.map((sequence: Sequence) => sequence.withoutSpaces),
      "oratio.core.currentTime"
    ).process(input, locale, context)

    return initialResponse.then((response: INeuronResponse) => {
      if (response instanceof SimpleResponse) {
        const date = new Date()
        const time = date.getHours() + ":" + date.getMinutes()

        return response.withParams([time])
      }

      return response
    })
  }
}
