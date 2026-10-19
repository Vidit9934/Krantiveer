import { PageHead } from "../components/PageHead";
import { Button } from "../components/Button";

export default function NotFound() {
  return (
    <>
      <PageHead title="Page not found" lede="That page is not on this record." />
      <div className="wrap section--tight row">
        <Button to="/">Back to the homepage</Button>
        <Button to="/contact" variant="secondary">
          Tell us what was missing
        </Button>
      </div>
    </>
  );
}
