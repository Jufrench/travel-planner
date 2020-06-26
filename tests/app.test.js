test('Should return city', () => {
    const mockPostCity = jest.fn(() => 'city');

    mockPostCity('city');

    expect(mockPostCity).toHaveReturnedWith('city');
})