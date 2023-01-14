const hre = require("hardhat");
const chai = require("chai");
chai.use(require("chai-as-promised"));

const circuitTestsFromData = ({ name, metadata, cases }) => {
    describe(name, () => {
        Object.entries(cases).forEach(([index, { input, output, hooks }]) => {
            it(`Proof Test #${index}`, async () => {
                if (output === null) {
                    await chai.expect(
                        hre.circom.generateProof(
                            name,
                            input
                        )
                    ).to.be.rejectedWith("Error in template");
                    return;
                }

                const { publicSignals } = await hre.circom.generateProof(
                    name,
                    input
                );

                chai.expect(publicSignals).to.be.eql(output);
            });

            if (hooks !== undefined) {
                hooks.forEach(({ name, f }) => {
                    it(`${name} #${index}`, async () => {
                        await f({ metadata, input, output });
                    });
                });
            }
        });
    });
};

module.exports = { circuitTestsFromData };
