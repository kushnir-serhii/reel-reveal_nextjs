"use client";
import { useEffect, useState } from "react";
import { genres } from "../../../../public/genres/genres";
import { arrayOfRatings, arrayOfYears } from "@/utils";
import { Button } from "../ui";
import { Icon } from "../ui/Icon";
import { MultiSelect } from "../ui/MultiSelect";
import { ListSelectedValues } from "../ui/MultiSelect/ListSelectedValues";
import { FilterArray, IQueryFilterParams } from "@/typification";
import { useResize } from "@/hooks";

interface MovieSearchFilterProps {
  getFilterOptions: (filter: IQueryFilterParams) => void;
  genreName: string | null;
}
export const MovieSearchFilter: React.FC<MovieSearchFilterProps> = ({
  getFilterOptions,
  genreName
}) => {
  const [allfilterOptions, setAllFilterOptions] = useState<FilterArray>([]);
  const [yearsArray, setYearsArray] = useState<FilterArray>([]);
  const [genresArray, setGenresArray] = useState<FilterArray>([]);
  const [ratingsArray, setRatingsArray] = useState<FilterArray>([]);

  const size = useResize();

  useEffect(() => {
    setAllFilterOptions([...genresArray, ...yearsArray, ...ratingsArray]);
  }, [yearsArray, genresArray, ratingsArray]);
  
  useEffect(() => {
    if (genreName) {
      setGenresArray([genreName]);
        // console.log("CALL_FUNCTION>>>>>>>>>>>>>>>>>>>>>>>");
      }
    }, [genreName]);
    
    useEffect(() => {
      if (genreName && genresArray) {
        handleFilterOptions();
      }
    }, [genreName, genresArray ]);
  const removeValue = (valueToRemove: string | number) => {
    const filter = allfilterOptions.filter((value) => value !== valueToRemove);

    setAllFilterOptions(filter);
  };

  const arrayIntersection = (arr1: FilterArray, arr2: FilterArray) => {
    const result = arr1.filter((value) => arr2.includes(value));

    return result;
  };

  const setIdGenresFromName = (
    arrayOfNames: string[],
    arrayOfObjects: { name: string; id: number }[]
  ) => {
    const arrayOfIds = arrayOfNames.map(
      (name: string) =>
        arrayOfObjects.find((element) => element.name === name)?.id
    );
    return arrayOfIds;
  };

  useEffect(() => {
    setGenresArray(arrayIntersection(genresArray, allfilterOptions));
    setYearsArray(arrayIntersection(yearsArray, allfilterOptions));
    setRatingsArray(arrayIntersection(ratingsArray, allfilterOptions));
  }, [allfilterOptions.length]);

  const handleFilterOptions = () => {
    getFilterOptions({
      genresId: setIdGenresFromName(
        genresArray.filter((value) => typeof value === "string"),
        genres
      ).filter((id) => id !== undefined),

      years: yearsArray.filter((value) => typeof value === "number"),

      rating: ratingsArray.filter((value) => {
        return typeof value === "number"
      }),
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full ">
      <div className="flex flex-wrap justify-between gap-6">
        <ul className="flex w-full gap-2 md:w-[412px] sm:gap-4">
          <li key={"Genre"} className="w-full md:w-[120px]">
            <MultiSelect
              isMulti={true}
              selectedOptions={genresArray}
              options={genres.map((genre) => genre.name)}
              setValue={setGenresArray}
              placeholder="Genre"
            />{" "}
          </li>
          <li key={"Year"} className="w-full md:w-[120px]">
            <MultiSelect
              selectedOptions={yearsArray}
              options={arrayOfYears(1900).reverse()}
              setValue={setYearsArray}
              placeholder="Year"
            />{" "}
          </li>
          <li key={"Rating"} className="w-full md:w-[120px]">
            <MultiSelect
              selectedOptions={ratingsArray}
              options={arrayOfRatings(91)}
              setValue={setRatingsArray}
              placeholder="Rating"
            />{" "}
          </li>
        </ul>
        <Button onClick={handleFilterOptions} className="md:w-[245px]">
          apply filters
        </Button>
      </div>
      <div className={`flex flex-wrap justify-between gap-6`}>
        <ListSelectedValues
          selectedValues={allfilterOptions}
          removeValue={removeValue}
        />
        {allfilterOptions.length > 1 && (
          <button
            type="button"
            onClick={() => setAllFilterOptions([])}
            className="flex items-center justify-center gap-2 text-textColor"
          >
            <span className=" text-lg font-light">
              {size > 860 ? "Clear all filters" : "Clear all"}
            </span>
            <span className="mt-1">
              <Icon id="cross" width={14} height={14} />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
