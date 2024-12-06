# XIV Rotation Builder

LWR SPA to build up GCD rotations and analyze potencies

## Running the Project in dev Mode

```bash
npm install
npm run test    # run all the tests: ts-compile, lint, jest-test, and prettier
npm run start   # run the server
```

Open the site at [http://localhost:3000](http://localhost:3000)

## Features
#### Calculator 
- Select a job
- Select actions
- Weave abilities
- See potency and potency per second
#### Optimizer
To get an optimized rotation simply
1. Select a job 
2. Select an optimization strategy 
3. Choose the desired rotation duration
4. Set your GCD 
5. Select a number of iterations (higher is better but takes longer)
6. Click optimize

To learn more about how the optimizer works check out the [Optimizer Documentation](./src/modules/xiv/optimizer/README.md)


## Appendix
Learn more about LWR: https://developer.salesforce.com/docs/platform/lwr/overview
