var patternDictionary;
var charCode_a = "a".charCodeAt(0);
var charCode_z = "z".charCodeAt(0);
var charCode_A = "A".charCodeAt(0);
var charCode_Z = "Z".charCodeAt(0);

function patternDictionaryInit()
{
	var result = {}
	for(var Idx = 0; Idx < dictionary.length; ++Idx)
	{
		var word = dictionary[Idx];
		var pattern = getLetterPattern(word);
		
		var wordList = result[pattern];
		if( wordList === undefined)
		{
			wordList = [];
			result[pattern] = wordList;
		}
		
		wordList.push(word);
	}
	patternDictionary = result;
}

function getLetterPattern(word)
{
	var letterIndexes = {};
	var nextIndex = 0;
	var result = "";
	var indexString = "abcdefghijklmnop";
	for(var Idx = 0; Idx < word.length; ++Idx)
	{
		var c = word[Idx];
		if(c === "'" || c === "-")
		{
			result += c;
		}
		else if(letterIndexes[c] === undefined)
		{
			var indexChar = indexString.charAt(nextIndex);
			result += indexChar;
			letterIndexes[c] = indexChar;
			nextIndex++;
		}
		else
		{
			result += letterIndexes[c];
		}
	}
	return result;
}

function getSuggestions(encryptedText, partialKey, total)
{
    var patternMatchList = patternDictionary[getLetterPattern(encryptedText)];
    var result = [];

    for (var Idx = 0; Idx < patternMatchList.length && result.length < total; ++Idx)
    {
        var matched = true;
        var suggestionWord = patternMatchList[Idx];
        var finalWord = "";

        for (var cIdx = 0; cIdx < suggestionWord.length; ++cIdx)
        {
            var cCode = encryptedText.charCodeAt(cIdx);
            var offset = -1;

            if (cCode >= charCode_a && cCode <= charCode_z )
            {
                offset = cCode - charCode_a;
            }
            else if (cCode >= charCode_A && cCode <= charCode_Z )
            {
                offset = cCode - charCode_A;
            }

            if (offset === -1)
            {
                finalWord += encryptedText[cIdx];
            }
            else
            {
                var cDecrypted = partialKey[offset];
                var finalChar = "";

                if (cDecrypted === '?' || cDecrypted === suggestionWord[cIdx])
                {
                    finalChar = suggestionWord[cIdx];
                }
                else
                {
                    matched = false;
                    break;
                }

                if (cCode >= charCode_A && cCode <= charCode_Z)
                {
                    finalWord += finalChar.toUpperCase();
                }
                else
                {
                    finalWord += finalChar;
                }
            }
        }

        if (matched)
        {
            result.push(finalWord);
        }
    }

    return result;
}