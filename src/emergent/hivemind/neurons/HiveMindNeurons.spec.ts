import {BasicHiveMindNeurons} from './HiveMindNeurons';
import { GreetingNeuron } from '../../../modules/core/GreetingNeuron';
import { TimeNeuron } from '../../../modules/core/TimeNeuron';
import { BasicUserInput } from '../../BasicUserInput';
import { BasicRequestContext } from '../../BasicRequestContext';
import { BasicLocale } from '../../../language/i18n/BasicLocale';
import { SimpleResponse } from '../../neurons/responses/SimpleResponse';

describe('BasicHiveMindNeurons', () => {
    let neurons: BasicHiveMindNeurons;
    const locale: string = 'en';
    let greetingNeuron = new GreetingNeuron();
    let timeNeuron = new TimeNeuron();

    beforeEach(() => {
        neurons = new BasicHiveMindNeurons(
            [greetingNeuron, timeNeuron],
            0.75,
        );
    });

    it('should detect fired neuron', function () {
        return neurons
            .findMatch(
                new BasicUserInput('What is the current time?'),
                new BasicRequestContext(null, null, new BasicLocale('en', 'us')),
            )
            .then(response => {
                expect((<SimpleResponse>response.getMostCertainResponse().getResponse()).response).toBe(
                    'oratio.core.currentTime',
                );
                expect(response.getMostCertainResponse().getFiredNeuron()).toBe(timeNeuron);
                return neurons.findMatch(
                    new BasicUserInput('hello'),
                    new BasicRequestContext(null, null, new BasicLocale('en', 'us')),
                );
            })
            .then(response => {
                expect((<SimpleResponse>response.getMostCertainResponse().getResponse()).response).toBe(
                    'oratio.core.hello',
                );
                expect(response.getMostCertainResponse().getFiredNeuron()).toBe(greetingNeuron);
            });
    });

    it('should place fired neuron to the top', function () {
        return neurons
            .findMatch(
                new BasicUserInput('What is the current time?'),
                new BasicRequestContext(null, null, new BasicLocale('en', 'us')),
            )
            .then(response => {
                expect((<SimpleResponse>response.getMostCertainResponse().getResponse()).response).toBe(
                    'oratio.core.currentTime',
                );
                expect(neurons['neurons'][0]).toBe(timeNeuron);
            });
    });
});
