pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract GOLSVG {
	uint256 constant P = 40;  // probability in precentage
	uint256 constant R = 6; // rounds
	uint256 constant D = 600; // duration in milliseconds

	uint256 constant W = 10; // width per cell
	uint256 constant H = 10; // height per cell

	string constant WHITE = "#ffffff";
	string constant BLACK = "#010108";
	string constant PURPLE = "#7232f2";

	string constant IN_INTERPOLATION = "0.25, 0.1, 0.25, 1.0";  // ease
	string constant OUT_INTERPOLATION = "0.0, 0.0, 0.58, 1.0";  // ease-out

    using Strings for uint256;

	function svgGen(
		uint256 solutionHash,
		uint256 result,
		uint256 width,
		uint256 height
	)
	public pure returns (string memory)
	{
		string memory rects = "";

		for (uint256 x = 0; x < width; x++) {
			for (uint256 y = 0; y < height; y++) {
				bool f = ((result >> (y + x * width)) & 1) == 1;
				rects = string.concat(
					rects,
					recGen(
						solutionHash,
						x,
						y,
						f
					)
				);
			}
		}

		string[] memory values = new string[](4);
		values[0] = "0";
		values[1] = "0";
		values[2] = ((width + 2) * W).toString();
		values[3] = ((height + 2) * H).toString();

		return string.concat(
			'<svg',
			attribute("viewbox", join(values, " ")),
			'>',
			rects,
			'</svg>'
		);
	}

	// x is before multiplication by W
	// y is before multiplication by H
	// actual x = (x + 1) * W;
	// actual y = (y + 1) * H;
	function recGen(
		uint256 solutionHash,
		uint256 x, 
		uint256 y, 
		bool f
	) 
	public pure returns (string memory)
	{
		string memory animations = "";
		bool true_last = false;
		bool purple_last = false;
		uint256 begin_last = 0;

		for (uint256 i = 0; i < R; i++) {
			bool r = roll(
				solutionHash,
				x,
				y,
				i
			);

            bool cut = false;

			if (true_last && r) {
				cut = i == R - 1;
			}
			else if (!true_last && r) {
				true_last = true;
				begin_last = i;
			}
			if (true_last && !r || cut) {
				if (cut) {
					purple_last = true;
				}

				true_last = false;
				animations = string.concat(
                    animations,
					'<animate',
					attribute("attributename", "fill"),
					attribute("from", WHITE),
					attribute("to", PURPLE),
					attribute("dur", string.concat(D.toString(), "ms")),
					attribute("begin", string.concat((D * begin_last).toString(), "ms")),
					attribute("fill", "freeze"),
					attribute("keysplines", IN_INTERPOLATION),
					'/>'
                );
                animations = string.concat(
                    animations,
					'<animate',
					attribute("attributename", "fill"),
					attribute("from", PURPLE),
					attribute("to", WHITE),
					attribute("dur", string.concat(D.toString(), "ms")),
					attribute("begin", string.concat((D * i).toString(), "ms")),
					attribute("fill", "freeze"),
					attribute("keysplines", IN_INTERPOLATION),
					'/>'
                );
			}
		}

		if (f) {
			string memory last_color = WHITE;
			if (purple_last) {
				last_color = PURPLE;
			}

			string[] memory values = new string[](3);
			values[0] = last_color;
			values[1] = PURPLE;
			values[2] = BLACK;

			animations = string.concat(
				animations,
				'<animate',
				attribute("attributename", "fill"),
				attribute("from", last_color),
				attribute("to", BLACK),
				attribute("dur", string.concat((D * 2).toString(), "ms")),
				attribute("begin", string.concat((D * (R - 1)).toString(), "ms")),
				attribute("values", join(values, "; ")),
				attribute("keytimes", "0; 0.6; 1"),
				attribute("fill", "freeze"),
				attribute("keysplines", IN_INTERPOLATION),
				'/>'
			);
		}

        return string.concat(
			'<rect',
			attribute("x", ((x + 1) * W).toString()),
			attribute("y", ((y + 1) * H).toString()),
			attribute("width", W.toString()),
			attribute("height", H.toString()),
			attribute("fill", WHITE),
			attribute("stroke", BLACK),
			'>',
            animations,
            '</rect>'
        );	
	}

	function attribute(string memory attrName, string memory val) internal pure returns (string memory) {
		return string.concat(
			' ',
			attrName,
			'="',
			val,
			'"'
		);
	}

	function join(string[] memory arr, string memory seperator) internal pure returns (string memory) {
		string memory accm = "";
		uint256 len = arr.length;

		for (uint256 i = 0; i < len; i++) {
			accm = string.concat(
				accm,
				arr[i],
				seperator
			);
		}
		
		return accm;
	}

	function roll(
		uint256 solutionHash, 
		uint256 x,
		uint256 y,
		uint256 round
	)
	internal pure returns (bool) {
		return uint256(keccak256(abi.encodePacked(solutionHash, x, y, round))) % 100 < P;
	}
}
