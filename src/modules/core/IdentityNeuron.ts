import {INeuronResponse} from '../../emergent/neurons/responses/SimpleResponse';
import {knownWords} from './IdentityNeuron.words';
import {LocalizedWordsMatcherNeuron} from '../../emergent/neurons/LocalizedWordsMatcherNeuron';
import {UserInput} from "../../emergent/BasicUserInput";
import {RequestContext} from "../../emergent/BasicRequestContext";
import { IHiveMindNeuron } from '../../emergent/hivemind/neurons/HiveMindNeurons';

export class IdentityNeuron implements IHiveMindNeuron {
    public process(input: UserInput,
                   context: RequestContext,): Promise<INeuronResponse> {
        return new LocalizedWordsMatcherNeuron(
            knownWords,
            'oratio.core.identity',
        ).process(input, context);
    }
}
