import { IImage } from "types";

export interface ICardProps {
  image: IImage;
  imageDescription: string;
  cardTitle: string;
  cardContentLines?: string[] | React.ReactNode[];
}

const ImageCard = ({
  image,
  imageDescription,
  cardTitle,
  cardContentLines,
}: ICardProps) => {
  return (
    <div className="card">
      <img className="card-img-top" src={image?.url} alt={imageDescription} />
      <div className="card-body">
        <h5 className="card-title">{cardTitle}</h5>
        {cardContentLines &&
          cardContentLines.map((line: string | React.ReactNode) => (
            <p className="card-text">{line}</p>
          ))}
      </div>
    </div>
  );
};

export default ImageCard;
