import { camelize } from '../build/modules/xiv/utils/utils.js';
process.stdin.on('data', (data) => {
    process.stdout.write(camelize(data + '\n'));
});
