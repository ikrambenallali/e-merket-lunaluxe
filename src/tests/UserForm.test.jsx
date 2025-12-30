import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserForm from "../components/Admin/UserForm";

describe("UserForm - RHF + Yup validation", () => {
  const onSubmit = jest.fn();

  beforeEach(() => {
    onSubmit.mockClear();
  });

  test("affiche les erreurs si le formulaire est vide et soumis", async () => {
    render(<UserForm onSubmit={onSubmit} />);
    const user = userEvent.setup();
    
    await user.click(screen.getByText("Enregistrer"));

    // Vérifier les messages d'erreur
    expect(await screen.findByText("Le nom est requis")).toBeInTheDocument();
    expect(await screen.findByText("L'email est requis")).toBeInTheDocument();
    // Message par défaut de Yup pour oneOf()
    expect(await screen.findByText("role must be one of the following values: user, seller, admin")).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });

 test("affiche une erreur si email invalide", async () => {
  const { container } = render(<UserForm onSubmit={onSubmit} />);
  const user = userEvent.setup();

  // Désactiver la validation HTML native
  const form = container.querySelector('form');
  form.noValidate = true;

  await user.type(screen.getByPlaceholderText("Ex: John Doe"), "Alice Doe");
  await user.type(screen.getByPlaceholderText("exemple@email.com"), "not-an-email");
  await user.selectOptions(screen.getByRole("combobox"), "user");

  await user.click(screen.getByText("Enregistrer"));

  // Matcher le texte réel dans le DOM
  expect(await screen.findByText("Email invalide")).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});


  test("soumission réussie si toutes les données sont valides", async () => {
    render(<UserForm onSubmit={onSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Ex: John Doe"), "Alice Doe");
    await user.type(screen.getByPlaceholderText("exemple@email.com"), "alice@example.com");
    await user.selectOptions(screen.getByRole("combobox"), "admin");

    await user.click(screen.getByText("Enregistrer"));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          fullname: "Alice Doe",
          email: "alice@example.com",
          role: "admin",
        },
        expect.anything()
      )
    );
  });
});