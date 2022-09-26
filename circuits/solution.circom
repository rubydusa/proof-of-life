// specific solution to game of life
template Solution() {
	signal input in[4][4];

	in[0][0] === 0;
	in[0][1] === 1;
	in[0][2] === 0;
	in[0][3] === 0;
	in[1][0] === 1;
	in[1][1] === 0;
	in[1][2] === 1;
	in[1][3] === 1;
	in[2][0] === 0;
	in[2][1] === 1;
	in[2][2] === 0;
	in[2][3] === 0;
	in[3][0] === 0;
	in[3][1] === 1;
	in[3][2] === 0;
	in[3][3] === 0;
}

